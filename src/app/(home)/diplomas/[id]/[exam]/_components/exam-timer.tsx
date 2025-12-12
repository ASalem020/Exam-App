'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";

interface ExamTimerProps {
    durationMinutes: number; // Total exam duration in minutes
    onTimeUp: () => void;
}

const chartConfig = {
  timeLeft: {
    label: "Time Left",
    color: "hsl(var(--chart-1))",
  },
  timeUsed: {
    label: "Time Used",
    color: "hsl(var(--muted))",
  },
} satisfies ChartConfig;

export default function ExamTimer({ durationMinutes, onTimeUp }: ExamTimerProps) {
    const totalSeconds = durationMinutes * 60;
    const [timeLeft, setTimeLeft] = useState(totalSeconds);

    useEffect(() => {
        if (timeLeft <= 0) {
            onTimeUp();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, onTimeUp]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate time used and percentage
    const timeUsed = totalSeconds - timeLeft;
    

    // Visual warning when time is low (e.g., less than 5 minutes)
    const isLowTime = timeLeft < 5 * 60;
    const isCriticalTime = timeLeft < 2 * 60;

    // Chart data with dynamic values
    const chartData = useMemo(() => [
        { 
            category: "timeLeft", 
            value: timeLeft, 
            fill: isCriticalTime ? "hsl(0 84% 60%)" : isLowTime ? "hsl(38 92% 50%)" : "hsl(221, 83%, 53%)" 
        },
        { 
            category: "timeUsed", 
            value: timeUsed, 
            fill: "hsl(var(--muted))" 
        },
    ], [timeLeft, timeUsed, isLowTime, isCriticalTime]);

    return (
        <div className="flex items-center w-fit h-fit justify-center">
            <ChartContainer
                config={chartConfig}
                className=" w-20 h-12"
            >
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="category"
                        innerRadius={19}
                        outerRadius={24}
                        strokeWidth={0}
                        endAngle={90}
                        startAngle={-270}
                    >
                        <Label
                            content={({ viewBox }: any) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                            <tspan
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                className={` text-xs  font-bold ${
                                                    isCriticalTime ? "fill-red-600" : isLowTime ? "fill-orange-600" : "fill-blue-600"
                                                }`}
                                            >
                                                {formatTime(timeLeft)}
                                            </tspan>
                                           
                                        </text>
                                    );
                                }
                            }}
                        />
                    </Pie>
                </PieChart>
            </ChartContainer>
        </div>
    );
}

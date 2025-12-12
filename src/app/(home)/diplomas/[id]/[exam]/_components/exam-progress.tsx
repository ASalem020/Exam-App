import React from 'react';

interface ExamProgressProps {
    currentQuestionIndex: number;
    totalQuestions: number;
}

export default function ExamProgress({ currentQuestionIndex, totalQuestions }: ExamProgressProps) {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-600">
                <span> </span>
                <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { ExamResultResponse } from '@/types/answers';
import { Question } from '@/types/questions';
import { CheckCircle, XCircle, RotateCcw, Eye } from 'lucide-react';

interface ExamResultsProps {
    result: ExamResultResponse;
    originalQuestions: Question[];
    userAnswers: Record<string, string>;
    onRestart: () => void;
}

export default function ExamResults({
    result,
    originalQuestions,
    userAnswers,
    onRestart,
}: ExamResultsProps) {
    const [showDetails, setShowDetails] = useState(false);

    const totalQuestions = result.correct + result.wrong;
    const correctPercentage = Math.round((result.correct / totalQuestions) * 100) || 0;
    const wrongPercentage = 100 - correctPercentage;

    // SVG Donut Chart Calculation
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const correctOffset = circumference - (correctPercentage / 100) * circumference;

    return (
        <div className="bg-white p-8 rounded-lg shadow-md space-y-8">
            {/* Summary Section */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                {/* Donut Chart */}
                <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        {/* Background Circle (Wrong/Total) */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke="#EF4444" // red-500
                            strokeWidth="12"
                        />
                        {/* Foreground Circle (Correct) */}
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            fill="transparent"
                            stroke="#22C55E" // green-500
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={correctOffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold text-gray-800">{correctPercentage}%</span>
                        <span className="text-sm text-gray-500">Score</span>
                    </div>
                </div>

                {/* Legend */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span className="text-gray-700 font-medium">Correct: {result.correct}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <span className="text-gray-700 font-medium">Incorrect: {result.wrong}</span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                    <RotateCcw className="w-4 h-4" />
                    Restart
                </button>
                <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Eye className="w-4 h-4" />
                    {showDetails ? 'Hide Results' : 'Explore Results'}
                </button>
            </div>

            {/* Detailed Results */}
            {showDetails && (
                <div className="space-y-6 mt-8 border-t pt-8">
                    <h3 className="text-xl font-bold text-gray-800">Detailed Review</h3>
                    <div className="grid gap-6">
                        {originalQuestions.map((question, index) => {
                            const userAnswerKey = userAnswers[question._id];
                            // Find if this question is in correctQuestions or WrongQuestions to know the correct answer
                            // Actually, the original question object has the 'correct' field!
                            // Wait, looking at src/types/questions.d.ts:
                            // "correct": "A2"
                            // So we have the correct answer key in the original question object.

                            const isCorrect = userAnswerKey === question.correct;
                            const userAnswerText = question.answers.find(a => a.key === userAnswerKey)?.answer;
                            const correctAnswerText = question.answers.find(a => a.key === question.correct)?.answer;

                            return (
                                <div key={question._id} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                                    <p className="font-medium text-gray-800 mb-3">
                                        {index + 1}. {question.question}
                                    </p>

                                    <div className="space-y-2">
                                        {/* User Answer */}
                                        <div className={`flex items-center gap-2 p-3 rounded ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                            <span className="font-medium">Your Answer:</span>
                                            <span>{userAnswerText || 'Skipped'}</span>
                                        </div>

                                        {/* Correct Answer (if wrong) */}
                                        {!isCorrect && (
                                            <div className="flex items-center gap-2 p-3 rounded bg-green-100 text-green-800">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-medium">Correct Answer:</span>
                                                <span>{correctAnswerText}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

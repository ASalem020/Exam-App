import { Question } from '@/lib/types/questions';
import React from 'react';

interface QuestionCardProps {
    question: Question;
    selectedAnswerKey?: string;
    onSelectAnswer: (key: string) => void;
    onTimeout: () => void;
}

export default function QuestionCard({
    question,
    selectedAnswerKey,
    onSelectAnswer,

}: QuestionCardProps) {
    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTIONS                                 */
    /* -------------------------------------------------------------------------- */
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{question.question}</h2>

            </div>

            <div className="space-y-3">
                {question.answers?.map((answer) => (
                    <div
                        key={answer.key}
                        onClick={() => onSelectAnswer(answer.key)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAnswerKey === answer.key
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAnswerKey === answer.key
                                    ? 'border-blue-500'
                                    : 'border-gray-300'
                                    }`}
                            >
                                {selectedAnswerKey === answer.key && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                )}
                            </div>
                            <span className="text-gray-700">{answer.answer}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

'use client'
import { BookOpenCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams, useParams } from 'next/navigation';
import React, { useState } from 'react'
import HomeHeader from '@/components/layout/home-header'
import ExamProgress from './_components/exam-progress';
import ExamTimer from './_components/exam-timer';
import QuestionCard from './_components/question-card';
import ExamResults from './_components/exam-results';
import { Button } from '@/components/ui/button';
import { useExamQuestions, useCheckExamAnswers } from '@/hooks/use-diplomas';
import { Loading } from '@/components/ui/spinner';

export default function Exam() {
    /* -------------------------------------------------------------------------- */
    /*                                 NAVIGATION                                 */
    /* -------------------------------------------------------------------------- */
    const searchParams = useSearchParams();
    const params = useParams();

    const diplomaName = params.id as string;
    const examTitle = params.exam as string;
    const examId = searchParams.get('exam');

    /* -------------------------------------------------------------------------- */
    /*                                    STATE                                   */
    /* -------------------------------------------------------------------------- */
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});

    /* -------------------------------------------------------------------------- */
    /*                                  MUTATIONS                                 */
    /* -------------------------------------------------------------------------- */
    const { mutate: checkQuestions, isPending: isSubmitting, data: examResult, reset: resetExam } = useCheckExamAnswers();

    /* -------------------------------------------------------------------------- */
    /*                                    HOOKS                                   */
    /* -------------------------------------------------------------------------- */
    const { data, isLoading, error } = useExamQuestions(examId);

    /* -------------------------------------------------------------------------- */
    /*                                  VARIABLES                                 */
    /* -------------------------------------------------------------------------- */
    const breadcrumbs = [
        { label: "Home", href: "/diplomas" },
        { label: "Diplomas", href: "/diplomas" },
        { label: diplomaName, href: `/diplomas/${diplomaName}` },
        { label: examTitle }
    ];

    const questions = data?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Get duration from the first question's exam details, default to 30 mins if missing
    const examDuration = questions[0]?.exam?.duration || 30;

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTIONS                                 */
    /* -------------------------------------------------------------------------- */
    const handleSelectAnswer = (key: string) => {
        if (!currentQuestion) return;
        setAnswers(prev => ({
            ...prev,
            [currentQuestion._id]: key
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishExam();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const finishExam = () => {
        const payload = {
            answers: Object.entries(answers).map(([questionId, answerKey]) => ({
                questionId,
                correct: answerKey
            })),
            time: examDuration
        };
        checkQuestions(payload);
    };

    const handleRestart = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        resetExam(); // Reset the mutation to clear exam results
    };

    if (isLoading) return <Loading text="Loading exam..." size="lg" />;
    if (error) return (
        <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-600 font-medium">Error loading exam: {(error as Error).message}</p>
        </div>
    );
    if (!questions.length) return (
        <div className="flex flex-col items-center justify-center p-8">
            <p className="text-gray-600 font-medium">No questions found for this exam.</p>
        </div>
    );

    if (examResult) {
        return (
            <div className="w-full">
                <HomeHeader
                    text="Exam Results"
                    icon={<BookOpenCheck className='text-white' />}
                    back={true}
                    breadcrumbs={breadcrumbs}
                />
                <ExamResults
                    result={examResult}
                    originalQuestions={questions}
                    userAnswers={answers}
                    onRestart={handleRestart}
                />
            </div>
        );
    }

    if (isSubmitting) {
        return <Loading text="Submitting your answers..." size="lg" />;
    }

    return (
        <div className="w-full">
            <HomeHeader
                text={questions[0]?.exam?.title || "Exam"}
                icon={<BookOpenCheck className='text-white' />}
                back={true}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex flex-col gap-2">
                {/* Top Bar: Timer and Progress */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-full">
                        <ExamProgress currentQuestionIndex={currentQuestionIndex} totalQuestions={totalQuestions} />
                    </div>
                </div>

                {/* Question Card */}
                <QuestionCard
                    question={currentQuestion}
                    selectedAnswerKey={answers[currentQuestion._id]}
                    onSelectAnswer={handleSelectAnswer}
                    onTimeout={finishExam}
                />

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <Button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`flex w-full transition-colors ${currentQuestionIndex === 0
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                            }`}
                    >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                    </Button>
                    <ExamTimer durationMinutes={examDuration} onTimeUp={finishExam} />
                    <Button
                        onClick={handleNext}
                        className="flex w-full items-center gap-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

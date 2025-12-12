'use client'
import { useQuery, useMutation } from '@tanstack/react-query'
import { BookOpenCheck, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import React, { useState } from 'react'
import HomeHeader from '@/components/layout/home-header'
import ExamProgress from './_components/exam-progress';
import ExamTimer from './_components/exam-timer';
import QuestionCard from './_components/question-card';
import ExamResults from './_components/exam-results';
import { QuestionsResponse } from '@/types/questions';
import { ExamResultResponse } from '@/types/answers';
import { Button } from '@/components/ui/button';

export default function Exam() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const params = useParams();
    

    const diplomaName = params.id as string;
    const examTitle = params.exam as string;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [examResult, setExamResult] = useState<ExamResultResponse | null>(null);

    const breadcrumbs = [
        { label: "Home", href: "/diplomas" },
        { label: "Diplomas", href: "/diplomas" },
        { label: diplomaName, href: `/diplomas/${diplomaName}` },
        { label: examTitle }
    ];

    const { data, isLoading, error } = useQuery<QuestionsResponse>({
        queryKey: ["singleExam", searchParams.get('exam')],
        queryFn: async () => {
            const res = await fetch(`https://exam.elevateegy.com/api/v1/questions/?exam=${searchParams.get('exam')}`, {
                headers: {
                    token: session?.accessToken as string
                }
            });
            return res.json();
        },
        enabled: !!session?.accessToken,
        refetchOnWindowFocus: false,
    });

    const { mutate: checkQuestions, isPending: isSubmitting } = useMutation({
        mutationFn: async (payload: any) => {
            const res = await fetch(`https://exam.elevateegy.com/api/v1/questions/check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: session?.accessToken as string
                },
                body: JSON.stringify(payload)
            });
            return res.json();
        },
        onSuccess: (data) => {
            setExamResult(data);
        },
        onError: (error) => {
            console.error("Error submitting exam:", error);
            alert("Failed to submit exam. Please try again.");
        }
    });

    const questions = data?.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    // Get duration from the first question's exam details, default to 30 mins if missing
    const examDuration = questions[0]?.exam?.duration || 30;

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
            time: examDuration // Sending total duration as per requirement/assumption
        };
        checkQuestions(payload);
    };

    const handleRestart = () => {
        setAnswers({});
        setCurrentQuestionIndex(0);
        setExamResult(null);
    };

    if (isLoading) return <div className="p-8 text-center">Loading exam...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading exam: {(error as Error).message}</div>;
    if (!questions.length) return <div className="p-8 text-center">No questions found for this exam.</div>;

    if (examResult) {
        return (
            <div className=" w-full p-4 ">
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
        return (
            <div className="  p-4   flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-xl font-medium text-gray-600">Submitting your answers...</p>
            </div>
        );
    }

    return (
        <div className=" w-full p-4   ">
            <HomeHeader 
                text={questions[0]?.exam?.title || "Exam"} 
                icon={<BookOpenCheck className='text-white' />} 
                back={true}
                breadcrumbs={breadcrumbs}
            />

            <div className="flex flex-col gap-2 ">
                {/* Top Bar: Timer and Progress */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                   
                    <div className="w-full ">
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
                <div className="flex justify-between ">
                    <Button
                        onClick={handlePrev}
                        disabled={currentQuestionIndex === 0}
                        className={`flex  w-full  transition-colors ${currentQuestionIndex === 0
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
                        className="flex w-full items-center gap-2  bg-blue-600 text-white  font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

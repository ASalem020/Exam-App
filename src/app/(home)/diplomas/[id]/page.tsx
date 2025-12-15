'use client'
import { BookOpenCheck, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react'
import HomeHeader from '@/components/layout/home-header'
import { useExams } from '@/hooks/use-diplomas';
import { Loading } from '@/components/ui/spinner';

export default function DiplomaExams() {
    /* -------------------------------------------------------------------------- */
    /*                                 NAVIGATION                                 */
    /* -------------------------------------------------------------------------- */
    const router = useRouter();
    const params = useParams();

    /* -------------------------------------------------------------------------- */
    /*                                    HOOKS                                   */
    /* -------------------------------------------------------------------------- */
    const { data, isLoading, error } = useExams();

    /* -------------------------------------------------------------------------- */
    /*                                  VARIABLES                                 */
    /* -------------------------------------------------------------------------- */
    const diplomaName = params.id as string;

    const breadcrumbs = [
        { label: "Home", href: "/diplomas" },
        { label: "Diplomas", href: "/diplomas" },
        { label: diplomaName }
    ];

    return (
        <div>
            <HomeHeader
                text="Exams"
                icon={<BookOpenCheck className='text-white' />}
                back={true}
                breadcrumbs={breadcrumbs}
            />
            {isLoading && ( <Loading text="Loading exams..." />)}
            {error && (
                <div className="flex flex-col items-center justify-center p-8">
                    <p className="text-red-600 font-medium">Error: {(error as Error).message}</p>
                </div>
            )}
            <div className='grid grid- gap-4'>
                {data?.exams?.map((exam: any) => (
                    <div
                        className='flex cursor-pointer bg-blue-400/20 p-2 items-center justify-between gap-4'
                        onClick={() => router.push(`/diplomas/${diplomaName}/${exam.title}?exam=${exam._id}`)}
                        key={exam._id}
                    >
                        <div>
                            <p className='text-lg font-bold text-blue-600'>{exam.title}</p>
                            <p>Questions: {exam.numberOfQuestions}</p>
                        </div>
                        <div className='flex gap-2'>
                            <Clock className='text-sm text-gray-500' />
                            <p className='text-sm text-gray-500'>Duration: {exam.duration} minutes</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

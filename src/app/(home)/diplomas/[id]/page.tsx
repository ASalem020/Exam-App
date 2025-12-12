'use client'
import { useQuery } from '@tanstack/react-query'
import { BookOpenCheck, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react'
import { useRouter, usePathname, useParams } from 'next/navigation';
import React from 'react'
import HomeHeader from '@/components/layout/home-header'

export default function DiplomaExams() {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const { data: session } = useSession();

    const diplomaName = params.id as string;

    const breadcrumbs = [
        { label: "Home", href: "/diplomas" },
        { label: "Diplomas", href: "/diplomas" },
        { label: diplomaName }
    ];

    const { data, isLoading, error } = useQuery({
        queryKey: ["exams"],
        queryFn: async () => {
            const res = await fetch(`https://exam.elevateegy.com/api/v1/exams`, {
                headers: {
                    token: session?.accessToken as string
                }
            });
            return res.json();
        },
        refetchOnMount: true,
        enabled: !!session?.accessToken


    });
    console.log(data)

    return (
        <div>
            <HomeHeader 
                text="Exams" 
                icon={<BookOpenCheck className='text-white' />} 
                back={true}
                breadcrumbs={breadcrumbs}
            />
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>{data.data}</p>}
            <div className='grid grid- gap-4'>

                {data?.exams?.map((exam: any) => (
                    <div className='flex cursor-pointer bg-blue-400/20 p-2 items-center justify-between gap-4' onClick={() => router.push(`${pathname}/${exam.title}?exam=${exam._id}`)} key={exam._id}>



                        <div>

                        <p className='text-lg font-bold text-blue-600'>{exam.title}</p>
                        <p> Questions:{exam.numberOfQuestions}</p>
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

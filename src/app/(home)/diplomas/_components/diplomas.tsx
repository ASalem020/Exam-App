
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Subject, SubjectsResponse } from '@/types/subjects';
import Image from 'next/image';

export default function Diplomas() {
    const router = useRouter();
    const { data: session } = useSession();
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDiplomas = async (pageNum: number) => {
        if (!session?.accessToken) return;

        try {
            // Only set loading on initial fetch
            if (pageNum === 1) setIsLoading(true);

            const res = await fetch(`https://exam.elevateegy.com/api/v1/subjects?page=${pageNum}$limit=4`, {
                headers: {
                    token: session.accessToken as string
                }
            });

            if (!res.ok) {
                throw new Error('Failed to fetch diplomas');
            }

            const data: SubjectsResponse = await res.json();

            if (data.subjects) {
                setSubjects(prev => pageNum === 1 ? data.subjects : [...prev, ...data.subjects]);

                // Check if we have reached the last page
                if (data.metadata) {
                    setHasMore(data.metadata.currentPage < data.metadata.numberOfPages);
                }

                setPage(pageNum);
            }
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.accessToken) {
            fetchDiplomas(1);
        }
    }, [session?.accessToken]);

    const loadMore = () => {
        setTimeout(() => {
            fetchDiplomas(page + 1);
        }, 1000);
    };

    if (isLoading && page === 1) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div
  id="scrollableDiv"
  className='min-h-screen h-screen overflow-y-scroll'
>
  {/*Put the scroll bar always on the bottom*/}
  <InfiniteScroll
    dataLength={subjects.length}
    next={loadMore}
    className='grid grid-cols-1  md:grid-cols-3  overflow-y-scroll gap-4'
    
    hasMore={hasMore}
    loader={<h4>Loading...</h4>}
    scrollableTarget="scrollableDiv"
     endMessage={
                <p className='text-center py-4 text-gray-500'>
                    <b>End of list</b>
                </p>
            }
  >
    {subjects.map((item) => (
                <div className='relative cursor-pointer   shadow-sm hover:shadow-md transition-shadow' onClick={() => router.push(`/diplomas/${item.name}`)} key={item._id}>
                    <Image src={item.icon} width={200} height={300} className='w-full   object-cover' alt={item.name} />
                    <div className='absolute w-full bg-blue-600/80 backdrop-blur-sm bottom-0 left-0 right-0 '>
                        <p className='p-3 text-white font-semibold text-center'>{item.name}</p>
                    </div>
                </div>
            ))}
  </InfiniteScroll>
</div>
        // <InfiniteScroll
        //     dataLength={subjects.length}
        //     next={loadMore}
        //     hasMore={hasMore}
        //     loader={<h4 className="text-center py-4">Loading more...</h4>}
        //     endMessage={
        //         <p style={{ textAlign: 'center', padding: '20px' }}>
        //             <b>End of list</b>
        //         </p>
        //     }
        //     className='grid grid-cols-1 md:grid-cols-2 gap-4'

        // >

        //     {subjects.map((item) => (
        //         <div className='relative cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow' onClick={() => router.push(`/diplomas/${item.name}`)} key={item._id}>
        //             <img src={item.icon} className='w-full h-64 object-cover' alt={item.name} />
        //             <div className='absolute w-full bg-blue-600/80 backdrop-blur-sm bottom-0 left-0 right-0 '>
        //                 <p className='p-3 text-white font-semibold text-center'>{item.name}</p>
        //             </div>
        //         </div>
        //     ))}
        // </InfiniteScroll>
    )
}

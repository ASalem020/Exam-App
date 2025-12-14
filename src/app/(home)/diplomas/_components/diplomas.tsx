'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';
import { Subject } from '@/lib/types/subjects';
import Image from 'next/image';
import { useSubjects } from '@/hooks/use-diplomas';
import { Loading, Spinner } from '@/components/ui/spinner';

export default function Diplomas() {
    /* -------------------------------------------------------------------------- */
    /*                                 NAVIGATION                                 */
    /* -------------------------------------------------------------------------- */
    const router = useRouter();

    /* -------------------------------------------------------------------------- */
    /*                                    HOOKS                                   */
    /* -------------------------------------------------------------------------- */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isLoading,
        error,
    } = useSubjects(4);

    /* -------------------------------------------------------------------------- */
    /*                                  VARIABLES                                 */
    /* -------------------------------------------------------------------------- */
    // Flatten all pages into a single array
    const subjects = data?.pages.flatMap(page => page.subjects) || [];

    /* -------------------------------------------------------------------------- */
    /*                                  FUNCTIONS                                 */
    /* -------------------------------------------------------------------------- */
    const loadMore = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    };

    if (isLoading) return <Loading text="Loading diplomas..." size="lg" />;
    if (error) return (
        <div className="flex flex-col items-center justify-center p-8">
            <p className="text-red-600 font-medium">Error: {(error as Error).message}</p>
        </div>
    );

    return (
        <div
            id="scrollableDiv"
            className='h-screen overflow-y-scroll'
        >
            <InfiniteScroll
                dataLength={subjects.length}
                next={loadMore}
                className=' h-full grid grid-cols-3 overflow-y-scroll gap-4'
                hasMore={!!hasNextPage}
                loader={
                    <div className="col-span-3 flex justify-center py-4">
                        <Spinner size="md" className="text-blue-600" />
                    </div>
                }
                scrollableTarget="scrollableDiv"
                endMessage={
                    <p className='text-center py-4 text-gray-500'>
                        <b>End of list</b>
                    </p>
                }
            >
                {subjects.map((item: Subject) => (
                    <div
                        className='relative cursor-pointer shadow-sm hover:shadow-md transition-shadow'
                        onClick={() => router.push(`/diplomas/${item.name}`)}
                        key={item._id}
                    >
                        <Image
                            src={item.icon}
                            width={200}
                            height={300}
                            className='w-full object-cover'
                            alt={item.name}
                        />
                        <div className='absolute w-full bg-blue-600/80 backdrop-blur-sm bottom-0 left-0 right-0'>
                            <p className='p-3 text-white font-semibold text-center'>{item.name}</p>
                        </div>
                    </div>
                ))}
            </InfiniteScroll>
        </div>
    )
}

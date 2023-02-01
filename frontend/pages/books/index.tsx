/* eslint-disable jsx-a11y/label-has-associated-control */
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { PreviewCardBook } from '../../components/preview/previewCardBook';
import prisma from '../../lib/prisma';
import { BookPreview } from '../../models/books';

interface Props {
    books: BookPreview[];
}

const Books: NextPage<Props> = ({ books }: Props) => {
    const router = useRouter();

    return (
        <>
            <div className='mt-5 w-fit rounded-xl'>
                <div className='mx-auto max-w-7xl py-8 px-6 lg:flex lg:justify-between lg:px-8'>
                    <div className='relative max-w-xl'>
                        <h2 className='text-2xl font-light tracking-tight sm:text-3xl lg:text-4xl'>
                            All Books
                        </h2>
                        <div className='absolute bottom-1/2 left-1/2 -z-10 h-1 w-0 rounded-full shadow-even-bg-md shadow-tertiary' />
                        {router.query.tag && (
                            <div className='mt-5 block text-sm font-light'>
                                <p>
                                    Sorting by:{' '}
                                    {(router.query.tag as string).toUpperCase()}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* <div className='mt-10 w-full max-w-xs'>
                        <label
                            htmlFor='search'
                            className='ml-3 block text-sm font-light'
                        >
                            Search for Anything
                        </label>
                        <div className='relative mt-1.5'>
                            <input
                                disabled
                                id='search'
                                type='text'
                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                placeholder='Coming Soon... maybe'
                            />
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='mt-5 flex flex-row flex-wrap items-center justify-evenly gap-10 p-3 sm:p-8 md:gap-20'>
                {books.map((book) => (
                    <PreviewCardBook
                        key={book.id}
                        bookId={book.id}
                        heading={book.title as string}
                        thumbnailSrc={book.coverImage as string}
                    />
                ))}
            </div>
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const books = await prisma.book.findMany({
        select: {
            id: true,
            title: true,
            authors: true,
            coverImage: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return {
        props: {
            books,
        },
        revalidate: 10,
    };
};

export default Books;

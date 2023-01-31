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
            <div className='mt-5 rounded-xl bg-secondary bg-opacity-30'>
                <div className='mx-auto max-w-7xl py-8 px-6 lg:flex lg:justify-between lg:px-8'>
                    <div className='max-w-xl'>
                        <h2 className='text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl'>
                            All Books
                        </h2>
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
                                className='relative block w-full appearance-none rounded-xl border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                placeholder='Coming Soon... maybe'
                            />
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='mt-5 flex flex-row flex-wrap items-center justify-evenly gap-10 p-3 sm:p-8'>
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

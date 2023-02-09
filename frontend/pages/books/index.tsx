/* eslint-disable jsx-a11y/label-has-associated-control */
import { GetStaticProps, NextPage } from 'next';
import React from 'react';
import { PreviewCardBook } from '../../components/preview/previewCardBook';
import prisma from '../../lib/prisma';
import { BookPreview } from '../../models/books';

interface Props {
    books: BookPreview[];
}

const Books: NextPage<Props> = ({ books }: Props) => (
    <div className='mb-24'>
        <div className='mt-5 w-full'>
            <div className='mx-auto flex max-w-7xl justify-center py-8 md:ml-20 md:justify-start'>
                <div className='relative max-w-xl'>
                    <h2 className='text-2xl font-light tracking-tight sm:text-3xl lg:text-4xl'>
                        All Books
                    </h2>
                    <div className='absolute bottom-1/2 left-1/2 -z-10 h-1 w-0 rounded-full shadow-even-bg-md shadow-tertiary' />
                </div>
            </div>
        </div>
        <div className='mt-5 flex flex-row flex-wrap items-center justify-evenly gap-y-14 gap-x-10 p-3 sm:p-8 md:gap-x-20 md:gap-y-20'>
            {books.map((book) => (
                <PreviewCardBook
                    key={book.id}
                    bookId={book.id}
                    heading={book.title as string}
                    thumbnailSrc={book.coverImage as string}
                />
            ))}
        </div>
    </div>
);

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

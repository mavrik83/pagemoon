/* eslint-disable react/prop-types */
import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { Book as BookModel } from '@prisma/client';
import prisma from '../../lib/prisma';
import { classNames, formatAuthors } from '../../utils/helpers';

interface Props {
    book: BookWithTagsThemes;
}

interface BookWithTagsThemes extends BookModel {
    tags: {
        name: string;
    }[];
    themes: {
        name: string;
    }[];
}

const BookDetail: NextPage<Props> = ({ book }) => (
    <main className='flex flex-col md:px-36'>
        <div className='md:flex md:flex-row'>
            <div className='relative mt-10 h-72 w-52 rounded-xl shadow-even shadow-secondary md:h-96 md:w-72'>
                <Image
                    className='rounded-xl object-cover object-center'
                    src={book.coverImage || ''}
                    alt='Book cover'
                    layout='fill'
                />
            </div>
            <div className='mt-10 flex flex-col justify-center text-base leading-3 md:ml-10 md:leading-10'>
                <h1 className='text-3xl'>{book.title}</h1>
                <h2>
                    by:{' '}
                    <span className='text-lg'>
                        {formatAuthors(book.authors as string)}
                    </span>
                </h2>
                <h3>
                    ISBN: <span className='text-lg'>{book.isbn}</span>
                </h3>
                <h3>
                    Published:{' '}
                    <span className='text-lg'>{book.datePublished}</span>
                </h3>
                <h3>
                    Pages: <span className='text-lg'>{book.pages}</span>
                </h3>
                <h3>
                    Publisher: <span className='text-lg'>{book.publisher}</span>
                </h3>
                <h3>
                    Language:{' '}
                    <span className='text-lg'>
                        {book.language === 'en' ? 'English' : book.language}
                    </span>
                </h3>
            </div>
        </div>

        <div
            className={classNames(
                book.themes.length ? '' : 'hidden',
                `mt-3 flex flex-row flex-wrap gap-3 md:w-72`,
            )}
        >
            Themes:{' '}
            {book.themes.map((theme) => (
                <span
                    key={theme.name}
                    className='inline-flex cursor-pointer items-center justify-self-center rounded-full bg-tertiary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'
                >
                    {theme.name}
                </span>
            ))}
        </div>
        <div
            className={classNames(
                book.tags.length ? '' : 'hidden',
                `mt-3 flex flex-row flex-wrap gap-3 md:w-72`,
            )}
        >
            Tags:{' '}
            {book.tags.map((tag) => (
                <span
                    key={tag.name}
                    className='inline-flex cursor-pointer items-center justify-self-center rounded-full bg-secondary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'
                >
                    {tag.name}
                </span>
            ))}
        </div>
        <div
            className={classNames(
                book.synopsis?.length ? '' : 'hidden',
                'mt-10 text-xl',
            )}
        >
            <h1>Description</h1>
            <p className='text-base'>{book.synopsis}</p>
        </div>
        <div>
            <h1
                className={classNames(
                    book.reviewIds.length ? '' : 'hidden',
                    'mt-10 text-xl',
                )}
            >
                Reviews
            </h1>
        </div>
    </main>
);

export const getStaticPaths: GetStaticPaths = async () => {
    const books = await prisma.book.findMany({
        select: {
            id: true,
        },
    });

    const paths = books.map((book) => ({
        params: { id: book.id },
    }));

    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const book = await prisma.book.findFirst({
        where: {
            id: params?.id as string,
        },
        include: {
            tags: {
                select: {
                    name: true,
                },
            },
            themes: {
                select: {
                    name: true,
                },
            },
        },
    });

    return {
        props: {
            book,
        },
        revalidate: 10,
    };
};

export default BookDetail;

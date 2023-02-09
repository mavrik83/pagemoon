/* eslint-disable react/prop-types */
import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import { MdOutlineCollectionsBookmark } from 'react-icons/md';
import { AiOutlineTags } from 'react-icons/ai';
import { Book as BookModel, Tag, Theme } from '@prisma/client';
import prisma from '../../lib/prisma';
import { classNames, formatAuthors } from '../../utils/helpers';
import { ContentPreviewCard } from '../../components/preview/previewContent';
import { badgeStyles } from '../../styles/badge';

interface Props {
    book: BookWithTagsThemes;
    reviews: {
        id: string;
        title: string;
        description: string;
        user: {
            firstName: string;
        };
    }[];
}

interface BookWithTagsThemes extends BookModel {
    tags: Tag[];
    themes: Theme[];
}

const BookDetail: NextPage<Props> = ({ book, reviews }) => (
    <main className='mb-40 flex flex-col md:px-36'>
        <div className='md:flex md:flex-row'>
            <div className='relative mt-10 h-72 w-52 rounded-xl shadow-even shadow-secondary md:h-96 md:w-72'>
                <Image
                    className='rounded-xl object-cover object-center'
                    src={book.coverImage || ''}
                    alt='Book cover'
                    layout='fill'
                />
            </div>
            <div className='mt-10 flex flex-col justify-end text-sm leading-3 md:ml-10 md:leading-8'>
                <h1 className='text-3xl'>{book.title}</h1>
                <h2>
                    <span className='text-base'>
                        {formatAuthors(book.authors as string)}
                    </span>
                </h2>
                <h3>
                    <span className='text-base'>{book.publisher}</span>
                </h3>
                <h3>
                    <span className='text-base'>{book.datePublished}</span>
                </h3>
                <h3>
                    ISBN: <span className='text-base'>{book.isbn}</span>
                </h3>
                <h3>
                    <span className='text-base'>{book.pages} pages</span>
                </h3>
                <h3>
                    <span className='text-base'>
                        {book.language === 'en' ? 'English' : book.language}
                    </span>
                </h3>
            </div>
        </div>
        <div className='mt-5'>
            <div
                className={classNames(
                    book.themes.length ? '' : 'hidden',
                    `mt-3 flex flex-row flex-wrap items-center gap-3 md:w-72`,
                )}
            >
                <MdOutlineCollectionsBookmark className='text-tertiary' />
                {book.themes.map((theme) => (
                    <span
                        key={theme.name}
                        className={badgeStyles({ color: 'tertiary' })}
                    >
                        {theme.name}
                    </span>
                ))}
            </div>
            <div
                className={classNames(
                    book.tags.length ? '' : 'hidden',
                    `mt-3 flex flex-row flex-wrap items-center gap-3 md:w-72`,
                )}
            >
                <AiOutlineTags className='text-secondary' />
                {book.tags.map((tag) => (
                    <span
                        key={tag.name}
                        className={badgeStyles({ color: 'secondary' })}
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
        </div>
        {reviews.length > 0 && (
            <div className='mt-10'>
                <h3 className='mb-5 text-xl'>Reviews:</h3>
                <div className='flex flex-col space-y-10'>
                    {reviews.map((review) => (
                        <ContentPreviewCard
                            key={review.id}
                            id={review.id}
                            title={review.title}
                            description={review.description}
                            author={review.user.firstName}
                        />
                    ))}
                </div>
            </div>
        )}
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
            tags: true,
            themes: true,
        },
    });

    const reviews = await prisma.review.findMany({
        where: {
            bookId: params?.id as string,
        },
        select: {
            id: true,
            title: true,
            description: true,
            user: {
                select: {
                    firstName: true,
                },
            },
        },
    });

    return {
        props: {
            reviews,
            book,
        },
        revalidate: 10,
    };
};

export default BookDetail;

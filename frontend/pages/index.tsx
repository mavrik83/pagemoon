import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import prisma from '../lib/prisma';
import { FeaturedBooks } from '../components/preview/featuredBooks';
import { BookPreview } from '../models/books';

interface Props {
    books: BookPreview[];
}

const Home: NextPage<Props> = ({ books }: Props) => (
    <div>
        <Head>
            <title>PageMoon</title>
            <meta name='description' content='PageMoon' />
            <link rel='icon' href='/favicon.ico' />
        </Head>
        <main className='my-5 mt-10 rounded-xl md:mt-20'>
            <div className='p-4 md:flex md:flex-row md:items-center'>
                <div className='h-full w-auto rounded-xl p-4 md:w-1/2'>
                    <section>
                        <div className='container relative mx-auto flex flex-col items-center text-center font-light '>
                            <h1 className='z-10 my-5 whitespace-nowrap text-3xl sm:text-5xl xl:max-w-3xl'>
                                Chidrens Books.
                            </h1>
                            <h1 className='z-10 my-5 text-3xl sm:text-5xl xl:max-w-3xl'>
                                Demystified.
                            </h1>
                            <div className='absolute bottom-1/2 left-1/2 h-1 w-0 rounded-full shadow-even-bg shadow-tertiary' />
                        </div>
                    </section>
                </div>
                <section className='mt-28 flex flex-col justify-center md:mt-0 md:w-1/2'>
                    <FeaturedBooks books={books} />
                </section>
            </div>
        </main>
    </div>
);

export default Home;

export const getStaticProps = async () => {
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
        take: 4,
    });

    return {
        props: {
            books,
        },
        revalidate: 10,
    };
};

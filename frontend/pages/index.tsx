import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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
        <main className='my-5'>
            <section>
                <div className='rounded-xl bg-tertiary'>
                    <div className='container mx-auto flex flex-col items-center px-4 py-8 text-center font-light md:py-12 md:px-10 lg:px-32'>
                        <h1 className='text-5xl leading-none sm:text-6xl xl:max-w-3xl'>
                            Welcome to PageMoon
                        </h1>
                        <p className='mt-6 text-lg xl:max-w-3xl'>
                            Our mission is to give parents real insights and
                            honest reviews of children&apos;s books. We are a
                            mother and daughter with a collective 30 years of
                            experience in early childhood education. We are
                            passionate about children&apos;s books and want to
                            share our love of reading with you.
                        </p>
                    </div>
                </div>
            </section>
            <section className='mt-20 flex flex-col justify-center'>
                <h2 className='text-center text-3xl font-light'>
                    Featured Books
                </h2>
                <FeaturedBooks books={books} />
            </section>
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

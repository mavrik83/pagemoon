import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import prisma from '../lib/prisma';
import { RecentPosts } from '../components/preview/recentPosts';
import { IPostPreview } from '../components/preview/previewCard';

interface Props {
    posts: IPostPreview[];
}

export const getStaticProps = async () => {
    const prePosts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            updatedAt: true,
            readTime: true,
            status: true,
            user: {
                select: {
                    firstName: true,
                },
            },
            categories: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    const posts = prePosts.map((post) => ({
        ...post,
        readTime: post.readTime!.toString(),
        updatedAt: post.updatedAt!.toISOString(),
    }));

    return {
        props: {
            posts,
        },
        revalidate: 10,
    };
};

const Home: NextPage<Props> = ({ posts }: Props) => (
    <div>
        <Head>
            <title>PageMoon</title>
            <meta name='description' content='Future home of PageMoon' />
            <link rel='icon' href='/favicon.ico' />
        </Head>
        <section className='my-5'>
            <div className='rounded-md bg-tertiary'>
                <div className='container mx-auto flex flex-col items-center px-4 py-16 pb-24 text-center md:py-32 md:px-10 lg:px-32 lg:pb-56'>
                    <h1 className='text-5xl leading-none sm:text-6xl xl:max-w-3xl'>
                        Welcome to PageMoon
                    </h1>
                    <p className='mt-6 mb-8 text-lg sm:mb-12 xl:max-w-3xl'>
                        Our mission is to give parents real insights and honest
                        reviews of children&apos;s books. We are a mother and
                        daughter with a collective 30 years of experience in
                        early childhood education. We are passionate about
                        children&apos;s books and want to share our love of
                        reading with you.
                    </p>
                </div>
            </div>
            <div className='mx-auto mb-12 -mt-20 w-5/6 sm:w-fit lg:-mt-40'>
                <Image
                    src='https://source.unsplash.com/random/500x500/?children,reading,books'
                    alt='random unsplash of children reading books'
                    className='rounded-lg bg-gray-500 shadow-md'
                    width={500}
                    height={500}
                />
            </div>
            <RecentPosts posts={posts} />
        </section>
    </div>
);

export default Home;

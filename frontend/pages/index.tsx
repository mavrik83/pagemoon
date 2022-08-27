import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Post } from '@prisma/client';
import prisma from '../lib/prisma';
import { RecentPosts } from '../components/preview/recentPosts';
import { Loader } from '../components/loader/loader';

interface Props {
    posts: Pick<Post, 'id' | 'title' | 'description' | 'createdAt'>[];
}

export const getStaticProps = async () => {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            description: true,
            createdAt: true,
        },
    });
    return {
        props: {
            posts,
        },
        revalidate: 10,
    };
};

const Home: NextPage<Props> = ({ posts }: Props) => {
    // const { execute, data, error, status } = useAsync(bookApi.getBooks);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = '';

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const post = posts[0];

    return (
        <div>
            <Head>
                <title>PageMoon</title>
                <meta name="description" content="Future home of PageMoon" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-6xl font-light">PageMoon</h1>
            <Loader />
            <RecentPosts />
        </div>
    );
};

export default Home;

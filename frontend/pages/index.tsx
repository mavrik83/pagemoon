import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import prisma from '../lib/prisma';
import { RecentPosts } from '../components/preview/recentPosts';
import { IPostPreview } from '../components/preview/previewCard';

interface Props {
    posts: IPostPreview[];
}

export const getStaticProps = async () => {
    const posts = await prisma.post.findMany({
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
    });
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
            <meta name="description" content="Future home of PageMoon" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <h1 className="text-6xl font-light px">PageMoon</h1>{' '}
        <RecentPosts posts={posts} />
    </div>
);

export default Home;

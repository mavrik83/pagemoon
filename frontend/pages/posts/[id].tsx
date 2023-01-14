import React from 'react';
import { Post as PostModel } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import parse from 'html-react-parser';
import Head from 'next/head';
import prisma from '../../lib/prisma';

interface Props {
    post: PostModel;
}

const Post: NextPage<Props> = ({ post }: Props) => (
    <div>
        <Head>
            <title>{post.title}</title>
            <meta name="description" content="Hire me!" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <article className="mx-auto max-w-2xl space-y-12 px-6 py-24 text-black">
            <div className="mx-auto w-full space-y-4 text-center">
                <p className="text-xs uppercase tracking-wider">
                    future home of category chips
                </p>
                <h1 className="text-4xl leading-tight md:text-5xl">
                    {post.title}
                </h1>
                <p className="text-sm text-black">{`by ${post.userId}`}</p>
            </div>
            <div className="placeholder-text:text-gray-500 prose prose-lg prose-stone my-10 font-light outline-none prose-h1:hidden prose-h1:text-3xl prose-h2:text-2xl prose-h2:font-light prose-h3:text-xl prose-h3:font-light prose-p:leading-none prose-strong:font-extrabold prose-li:leading-none">
                {parse(post.htmlContent!)}
            </div>
        </article>
    </div>
);

export const getStaticPaths = async () => {
    const posts = await prisma.post.findMany({
        select: {
            id: true,
        },
    });

    const paths = posts.map((post) => ({
        params: { id: post.id },
    }));

    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const post = await prisma.post.findFirst({
        where: {
            id: params?.id as string,
        },
    });

    return {
        props: {
            post,
        },
    };
};

export default Post;

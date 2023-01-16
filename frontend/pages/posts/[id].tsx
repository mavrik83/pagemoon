import React from 'react';
import { Post as PostModel } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import parse from 'html-react-parser';
import Head from 'next/head';
import prisma from '../../lib/prisma';

interface Props {
    post: PostWithCategories;
}

interface PostWithCategories extends PostModel {
    categories: {
        name: string;
    }[];
    user: {
        firstName: string;
        lastName: string;
    };
}

const Post: NextPage<Props> = ({ post }: Props) => (
    <div>
        <Head>
            <title>{post.title}</title>
            <meta name='description' content='Hire me!' />
            <link rel='icon' href='/favicon.ico' />
        </Head>
        <article className='mx-auto max-w-2xl space-y-12 px-6 py-24'>
            <div className='mx-auto w-full space-y-4 text-center'>
                {post.categories.map((category) => (
                    <span className='mx-2 inline-flex cursor-pointer items-center rounded-full bg-secondary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'>
                        {category.name}
                    </span>
                ))}

                <h1 className='text-4xl leading-tight md:text-5xl'>
                    {post.title}
                </h1>
                <p className='text-sm font-light'>{`by ${post.user.firstName} ${post.user.lastName}`}</p>
            </div>
            <div className='placeholder-text:text-neutral-500 prose prose-lg prose-neutral my-10 font-light outline-none prose-h1:hidden prose-h1:text-3xl prose-h2:text-2xl prose-h2:font-light prose-h3:text-xl prose-h3:font-light prose-p:leading-normal prose-strong:font-extrabold prose-li:leading-none'>
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
        include: {
            categories: {
                select: {
                    name: true,
                },
            },
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    return {
        props: {
            post,
        },
        revalidate: 10,
    };
};

export default Post;

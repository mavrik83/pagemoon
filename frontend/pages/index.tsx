import React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Post, User } from '@prisma/client';
// import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
// import Placeholder from '@tiptap/extension-placeholder';
// import Typography from '@tiptap/extension-typography';
// import TextAlign from '@tiptap/extension-text-align';
// import { generateHTML } from '@tiptap/html';
// import { JSONContent } from '@tiptap/react';
// import { bookApi } from '../utils/api';
// import { useAsync } from '../utils/hooks/useAsync';
// import { Button } from '../components';
import prisma from '../lib/prisma';
import { PreviewCard } from '../components/previewCard';

interface Props {
    users: Pick<User, 'id' | 'firstName'>[];
    posts: Pick<Post, 'id' | 'title' | 'description' | 'createdAt'>[];
}

export const getStaticProps = async () => {
    const users = await prisma.user.findMany({
        select: {
            firstName: true,
            id: true,
        },
    });
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
            users,
            posts,
        },
    };
};

const Home: NextPage<Props> = ({ users, posts }: Props) => {
    // const { execute, data, error, status } = useAsync(bookApi.getBooks);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const dummy = '';

    // const html = generateHTML(post.rawContent as JSONContent, [
    //     Underline,
    //     Placeholder,
    //     Typography,
    //     TextAlign,
    //     StarterKit,
    // ]);

    return (
        <div>
            <Head>
                <title>PageMoon</title>
                <meta name="description" content="Future home of PageMoon" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-6xl font-light">PageMoon</h1>

            <br />
            <h3 className="text-3xl font-light">First User:</h3>
            <p>First Name: {users[0].firstName}</p>
            <div className="grid max-w-lg gap-5 mx-auto mt-12 lg:grid-cols-3 lg:max-w-none">
                {posts &&
                    posts.map((post) => (
                        <PreviewCard key={post.id} post={post} />
                    ))}
            </div>
        </div>
    );
};

export default Home;

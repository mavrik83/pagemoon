import React from 'react';
import type { NextPage } from 'next';
import {
    IPostPreview,
    PreviewCard,
} from '../../components/preview/previewCard';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

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

const Posts: NextPage<Props> = ({ posts }: Props) => {
    const { authUser } = useFirebaseAuth();

    return (
        <>
            <div className="mt-5 flex h-screen-1/2 items-center justify-center rounded-md bg-secondary bg-opacity-20">
                <h1 className="-mt-36 text-3xl leading-none text-black sm:mt-0 sm:text-4xl xl:max-w-3xl">
                    All Reviews
                </h1>
            </div>
            <div className="mx-5 -mt-48 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                {posts
                    .filter((post) =>
                        // if user is logged in, show all posts. Otherwise, only show published posts
                        authUser ? true : post.status === 'published',
                    )
                    .map((post) => (
                        <PreviewCard key={post.id} post={post} />
                    ))}
            </div>
        </>
    );
};

export default Posts;

import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import {
    IPostPreview,
    PreviewCard,
} from '../../components/preview/previewCard';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import prisma from '../../lib/prisma';

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
        orderBy: {
            createdAt: 'desc',
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
    const router = useRouter();

    return (
        <>
            <div className='mt-5 flex h-screen-1/2 items-center justify-center rounded-md bg-secondary bg-opacity-20'>
                <h1 className='-mt-36 text-3xl leading-none sm:mt-0 sm:text-4xl xl:max-w-3xl'>
                    {router.query.category ? (
                        <span className='block text-4xl font-extrabold tracking-tight sm:text-5xl'>
                            Category: {router.query.category}
                        </span>
                    ) : (
                        <span className='block text-4xl font-extrabold tracking-tight sm:text-5xl'>
                            All Reviews
                        </span>
                    )}
                </h1>
            </div>
            <div className='mx-5 -mt-48 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3'>
                {posts
                    .filter((post) =>
                        // if user is logged in, show all posts. Otherwise, only show published posts
                        authUser ? true : post.status === 'published',
                    )
                    .filter((post) =>
                        // if router.query.category is defined, filter posts by category
                        router.query.category
                            ? post.categories.some(
                                  (category) =>
                                      category.name.toLowerCase() ===
                                      router.query.category,
                              )
                            : true,
                    )

                    .map((post) => (
                        <PreviewCard key={post.id} post={post} />
                    ))}
            </div>
        </>
    );
};

export default Posts;

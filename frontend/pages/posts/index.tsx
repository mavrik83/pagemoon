/* eslint-disable jsx-a11y/label-has-associated-control */
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
            createdAt: true,
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
            <div className='mt-5 rounded-md bg-secondary bg-opacity-30'>
                <div className='sm:py-18 mx-auto max-w-7xl py-16 px-6 lg:flex lg:justify-between lg:px-8'>
                    <div className='max-w-xl'>
                        <h2 className='text-4xl font-light tracking-tight sm:text-5xl lg:text-6xl'>
                            All Reviews
                        </h2>
                        <p className='mt-5 text-xl'>
                            Click on any category to filter the reviews.
                        </p>
                        {router.query.category && (
                            <div className='mt-5 block text-sm font-light'>
                                <p>
                                    Sorting by:{' '}
                                    {(
                                        router.query.category as string
                                    ).toUpperCase()}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='mt-10 w-full max-w-xs'>
                        <label
                            htmlFor='search'
                            className='ml-3 block text-sm font-light'
                        >
                            Search for Anything
                        </label>
                        <div className='relative mt-1.5'>
                            <input
                                id='search'
                                type='text'
                                className='relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-neutral-400 focus:z-10 focus:border-tertiary focus:outline-none focus:ring-tertiary sm:text-sm'
                                placeholder='Start typing...'
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='mx-5 mt-5 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3'>
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

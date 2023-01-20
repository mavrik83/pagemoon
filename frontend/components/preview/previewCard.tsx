/* eslint-disable @next/next/no-img-element */
import React, { useRef } from 'react';
import { Post } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { RiQuillPenLine } from 'react-icons/ri';
import { IoBookOutline } from 'react-icons/io5';
import { TbTags, TbWriting, TbSettings } from 'react-icons/tb';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { BookCover } from '../../utils/api/Books';

export interface IPostPreview extends Partial<Post> {
    user: {
        firstName: string;
    };
    categories: {
        name: string;
    }[];
    book: {
        title: string;
    };
}

interface Props {
    post: IPostPreview;
    bookCover: BookCover;
}

export const PreviewCard: React.FC<Props> = ({ post, bookCover }) => {
    const { authUser } = useFirebaseAuth();
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);

    const [createdAt, setCreatedAt] = React.useState<string | null>(
        post.createdAt?.toUTCString() as string,
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCreatedAt(post.createdAt!.toDateString());
        }, 1000);

        return () => clearInterval(interval);
    }, [post.createdAt]);

    return (
        <div
            key={post.id}
            className='flex flex-row overflow-hidden rounded-lg border border-primary bg-white shadow-lg hover:border-secondary'
        >
            <div className='flex flex-1 flex-col justify-between bg-primary bg-opacity-10 p-3'>
                <Link href={`/posts/${post.id}`}>
                    <div className='relative -m-3 mb-5 h-28 w-auto animate-shimmer cursor-pointer bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:400%_100%] md:hidden'>
                        {bookCover && (
                            <Image
                                className='h-full w-full rounded-b-lg object-cover'
                                src={bookCover.coverImage as string}
                                alt={post.title as string}
                                layout='fill'
                            />
                        )}
                    </div>
                </Link>
                <div className='flex-1'>
                    <Link href={`/posts/${post.id}`}>
                        <div className='flex cursor-pointer flex-row items-center gap-2 '>
                            <IoBookOutline className='shrink-0 grow-0 self-center text-2xl text-tertiary' />
                            <p className='text-xl font-semibold'>
                                {post?.book?.title || post.title}
                            </p>
                        </div>
                    </Link>
                    <div className='mt-3 flex flex-row items-center gap-2'>
                        <TbTags className='shrink-0 grow-0 self-center text-2xl text-tertiary' />
                        <div
                            ref={ref}
                            className='flex flex-row flex-wrap gap-2'
                        >
                            {post.categories.map((category) => (
                                <Link
                                    href={{
                                        pathname: '/posts',
                                        query: {
                                            category:
                                                category.name.toLowerCase(),
                                        },
                                    }}
                                    key={category.name}
                                >
                                    <span className='inline-flex cursor-pointer items-center justify-self-center rounded-full bg-secondary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'>
                                        {category.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <Link href={`/posts/${post.id}`}>
                        <div className='mt-3 hidden cursor-pointer flex-row gap-2 md:flex'>
                            <RiQuillPenLine className='shrink-0 grow-0 self-center text-2xl text-tertiary' />
                            <p className='text-base text-neutral-600 line-clamp-3'>
                                {post.description === 'No description'
                                    ? post.title
                                    : post.description}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className='mt-3 flex items-center'>
                    <div className='flex flex-row items-center gap-2'>
                        <TbWriting className='shrink-0 grow-0 self-center text-2xl text-tertiary' />
                        <div>
                            <p className='text-sm font-medium'>
                                By: {post.user.firstName}
                            </p>
                            <div className='flex space-x-1 text-sm text-neutral-500'>
                                <time dateTime={createdAt as string}>
                                    {createdAt}
                                </time>
                                <span aria-hidden='true'>&middot;</span>
                                <span>
                                    {post.readTime?.toString()} minute read
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {authUser && (
                    <div className='mt-3 flex flex-row items-center gap-2'>
                        <TbSettings className='shrink-0 grow-0 self-center text-2xl text-tertiary' />
                        <button
                            type='button'
                            className='flex w-fit items-center gap-2'
                            onClick={() => router.push(`/editor/${post.id}`)}
                        >
                            <span className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-light hover:scale-110 hover:cursor-pointer'>
                                Edit
                            </span>
                        </button>
                        {post.status === 'draft' ? (
                            <span className='inline-flex items-center rounded-full bg-alert bg-opacity-30 px-3 py-0.5 text-sm font-light'>
                                Draft
                            </span>
                        ) : (
                            <span className='inline-flex items-center rounded-full bg-success bg-opacity-30 px-3 py-0.5 text-sm font-light'>
                                Published
                            </span>
                        )}
                    </div>
                )}
            </div>
            <Link href={`/posts/${post.id}`}>
                <div className='hidden h-auto w-28 animate-shimmer cursor-pointer bg-gradient-to-r from-primary via-tertiary to-primary bg-[length:400%_100%] md:relative md:block'>
                    {bookCover && (
                        <Image
                            className='h-full w-full object-cover'
                            src={bookCover.coverImage as string}
                            alt={post.title as string}
                            layout='fill'
                        />
                    )}
                </div>
            </Link>
        </div>
    );
};

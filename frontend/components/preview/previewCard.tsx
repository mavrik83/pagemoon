import { Post } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { classNames } from '../../utils/helpers';
import { useOverflow } from '../../utils/hooks/useOverflow';

export interface IPostPreview extends Partial<Post> {
    user: {
        firstName: string;
    };
    categories: {
        name: string;
    }[];
}

interface Props {
    post: IPostPreview;
}

export const PreviewCard: React.FC<Props> = ({ post }) => {
    const { authUser } = useFirebaseAuth();
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const isOverflowing = useOverflow(ref);

    const [updatedAt, setUpdatedAt] = React.useState<string>(
        post.updatedAt!.toUTCString(),
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            setUpdatedAt(post.updatedAt!.toDateString());
        }, 1000);

        return () => clearInterval(interval);
    }, [post.updatedAt]);

    return (
        <div
            key={post.id}
            className='flex flex-col overflow-hidden rounded-lg border border-primary bg-white shadow-lg hover:border-secondary'
        >
            <div className='flex flex-1 flex-col justify-between bg-primary bg-opacity-5 p-6'>
                <div className='flex-1'>
                    <div
                        ref={ref}
                        className={classNames(
                            isOverflowing
                                ? 'grid grid-cols-4'
                                : 'flex flex-row',
                            'gap-3',
                        )}
                    >
                        {post.categories.map((category) => (
                            <Link
                                href={{
                                    pathname: '/posts',
                                    query: {
                                        category: category.name.toLowerCase(),
                                    },
                                }}
                                key={category.name}
                            >
                                <span className='inline-flex cursor-pointer items-center justify-self-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium'>
                                    {category.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                    <Link href={`/posts/${post.id}`}>
                        <div className='h-full cursor-pointer'>
                            <p className='mt-3 cursor-pointer text-xl font-semibold'>
                                {post.title}
                            </p>
                            <p className='mt-3 text-base text-neutral-600 line-clamp-5'>
                                {post.description}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className='mt-2 flex items-center'>
                    <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-tertiary bg-opacity-30'>
                        <span className='text-xl font-medium leading-none'>
                            {post.user.firstName[0]}
                        </span>
                    </span>
                    <div className='ml-3'>
                        <p className='text-sm font-medium'>
                            {post.user.firstName}
                        </p>
                        <div className='flex space-x-1 text-sm text-neutral-500'>
                            <time dateTime={updatedAt}>{updatedAt}</time>
                            <span aria-hidden='true'>&middot;</span>
                            <span>{post.readTime?.toString()} minute read</span>
                        </div>
                    </div>
                </div>
                {authUser && (
                    <button
                        type='button'
                        className='mt-6 flex w-fit items-center gap-2'
                        onClick={() => router.push(`/editor/${post.id}`)}
                    >
                        <span className='inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium hover:scale-110'>
                            Edit
                        </span>
                        {post.status === 'draft' && (
                            <span className='inline-flex items-center rounded-full bg-alert bg-opacity-30 px-3 py-0.5 text-sm font-medium hover:scale-110'>
                                Draft
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

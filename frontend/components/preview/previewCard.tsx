import { Post } from '@prisma/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';

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

    return (
        <div
            key={post.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg"
        >
            <div className="flex flex-1 flex-col justify-between bg-white p-6">
                <div className="flex-1">
                    <div className="flex flex-row gap-3">
                        {post.categories.map((category) => (
                            <span
                                key={category.name}
                                className="inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium text-gray-800"
                            >
                                {category.name}
                            </span>
                        ))}
                    </div>
                    <Link href={`/posts/${post.id}`}>
                        <div className="h-full cursor-pointer">
                            <p className="mt-3 cursor-pointer text-xl font-semibold text-gray-900">
                                {post.title}
                            </p>
                            <p className="mt-3 text-base text-gray-500 line-clamp-5">
                                {post.description}
                            </p>
                        </div>
                    </Link>
                </div>
                <div className="mt-2 flex items-center">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tertiary bg-opacity-30">
                        <span className="text-xl font-medium leading-none text-gray-800">
                            {post.user.firstName[0]}
                        </span>
                    </span>
                    <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                            {post.user.firstName}
                        </p>
                        <div className="flex space-x-1 text-sm text-gray-500">
                            <time dateTime={post.updatedAt?.toDateString()}>
                                {post.updatedAt?.toDateString()}
                            </time>
                            <span aria-hidden="true">&middot;</span>
                            <span>{post.readTime?.toString()} minute read</span>
                        </div>
                    </div>
                </div>
                {authUser && (
                    <button
                        type="button"
                        className="mt-6 flex items-center gap-2"
                        onClick={() => router.push(`/editor/${post.id}`)}
                    >
                        <span className="inline-flex items-center rounded-full bg-secondary bg-opacity-30 px-3 py-0.5 text-sm font-medium text-gray-800 hover:scale-110">
                            Edit
                        </span>
                        {post.status === 'draft' && (
                            <span className="inline-flex items-center rounded-full bg-alert bg-opacity-30 px-3 py-0.5 text-sm font-medium text-gray-800 hover:scale-110">
                                Draft
                            </span>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

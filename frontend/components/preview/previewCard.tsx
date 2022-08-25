import { Post } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

interface Props {
    post: Pick<Post, 'id' | 'title' | 'description' | 'createdAt'>;
}

export const PreviewCard: React.FC<Props> = ({ post }) => (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg">
        <div className="flex-shrink-0">
            <Image
                className="object-cover w-full h-48"
                src="https://dummyimage.com/400/eeab7b/007989.jpg&text=Preview+Image"
                alt="placeholder"
                width={400}
                height={192}
            />
        </div>
        <div className="flex flex-col justify-between flex-1 p-6 bg-white">
            <div className="flex-1">
                <div className="block mt-2">
                    <p className="text-xl font-semibold text-gray-900">
                        {post.title}
                    </p>
                    <p className="mt-3 text-base text-gray-500">
                        {post.description}
                    </p>
                </div>
            </div>
            <div className="flex items-center mt-6">
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                        Some cool text
                    </p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                        <time>{post.createdAt?.toLocaleTimeString()}</time>
                        <span aria-hidden="true">&middot;</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

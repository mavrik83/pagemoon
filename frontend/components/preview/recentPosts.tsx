/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { PreviewCard, IPostPreview } from './previewCard';

interface Props {
    posts: IPostPreview[];
}

export const RecentPosts: React.FC<Props> = ({ posts }) => (
    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
        {posts.map((post) => (
            <PreviewCard key={post.id} post={post} />
        ))}
    </div>
);

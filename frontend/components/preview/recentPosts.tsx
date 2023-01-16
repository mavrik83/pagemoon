/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { PreviewCard, IPostPreview } from './previewCard';

interface Props {
    posts: IPostPreview[];
}

export const RecentPosts: React.FC<Props> = ({ posts }) => {
    const { authUser } = useFirebaseAuth();

    return (
        <div className='mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3'>
            {posts
                .filter((post) =>
                    // if user is logged in, show all posts. Otherwise, only show published posts
                    authUser ? true : post.status === 'published',
                )
                .slice(0, 3)
                .map((post) => (
                    <PreviewCard key={post.id} post={post} />
                ))}
        </div>
    );
};

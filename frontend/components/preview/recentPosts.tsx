/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { IPostPreview } from '../../models/posts';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { PreviewCard } from './previewCard';

interface Props {
    posts: IPostPreview[];
}

export const RecentPosts: React.FC<Props> = ({ posts }) => {
    const { authUser } = useFirebaseAuth();

    return (
        <div className='mx-auto mt-12 grid max-w-lg gap-5 pb-10 lg:max-w-none lg:grid-cols-2'>
            {posts
                .filter((post) =>
                    // if user is logged in, show all posts. Otherwise, only show published posts
                    authUser ? true : post.status === 'published',
                )
                .map((post) => (
                    <PreviewCard
                        key={post.id}
                        post={post}
                        bookCover={post.book.coverImage || ''}
                    />
                ))}
        </div>
    );
};

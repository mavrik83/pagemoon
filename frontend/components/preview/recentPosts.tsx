/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { BookCover } from '../../utils/api/Books';
import { useFirebaseAuth } from '../../utils/contexts/firebaseProvider';
import { PreviewCard, IPostPreview } from './previewCard';

interface Props {
    posts: IPostPreview[];
    bookCovers: BookCover[];
}

export const RecentPosts: React.FC<Props> = ({ posts, bookCovers }) => {
    const { authUser } = useFirebaseAuth();

    return (
        <div className='mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-2'>
            {posts
                .filter((post) =>
                    // if user is logged in, show all posts. Otherwise, only show published posts
                    authUser ? true : post.status === 'published',
                )
                .slice(0, 2)
                .map((post) => {
                    const bookCover = bookCovers.find(
                        (cover) => cover.id === post.bookId,
                    );
                    return (
                        <PreviewCard
                            key={post.id}
                            post={post}
                            bookCover={bookCover as BookCover}
                        />
                    );
                })}
        </div>
    );
};

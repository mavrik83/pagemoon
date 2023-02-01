import React from 'react';
import { BookPreview } from '../../models/books';
import { PreviewCardBook } from './previewCardBook';

interface Props {
    books: BookPreview[];
}

export const FeaturedBooks: React.FC<Props> = ({ books }) => (
    <div className='md:gap-15 mt-5 flex flex-row flex-wrap items-center justify-evenly gap-5 lg:gap-20'>
        {books.map((book) => (
            <PreviewCardBook
                key={book.id}
                bookId={book.id}
                thumbnailSrc={book.coverImage || ''}
                heading={book.title!}
            />
        ))}
    </div>
);

import React from 'react';
import { MyLink } from '../reusable';

interface Props {
    title: string;
    description: string;
    author: string;
    id: string;
}

export const ContentPreviewCard: React.FC<Props> = ({
    title,
    description,
    author,
    id,
}) => (
    <MyLink href={`/reviews/${id}`}>
        <div className='group flex w-full max-w-md flex-col items-center justify-center '>
            <div className='h-30 w-full rounded-xl bg-primary bg-opacity-10 bg-cover bg-center shadow-blur shadow-primary-10'>
                <div className='flex w-full flex-col items-center justify-center'>
                    <div className='flex w-full flex-row items-center justify-between align-middle'>
                        <h1 className='px-2 pt-1 text-lg font-normal line-clamp-2'>
                            {title}
                        </h1>
                        <p className='px-2 pt-1 text-base'>
                            by:{' '}
                            <span className='whitespace-nowrap'>{author}</span>
                        </p>
                    </div>
                    <p className='px-2 pt-3 pb-1 text-sm line-clamp-3'>
                        {description}
                    </p>
                </div>
            </div>
        </div>
    </MyLink>
);

/* eslint-disable react/require-default-props */
/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Image from 'next/image';
import { MyLink } from '../reusable';

interface Props {
    thumbnailSrc?: string;
    thumbnailAlt?: string;
    heading?: string;
    bookId?: string;
}

export const PreviewCardBook: React.FC<Props> = ({
    thumbnailSrc,
    thumbnailAlt = 'Book cover',
    heading,
    bookId,
}) => (
    <MyLink href={`books/${bookId}`}>
        <div className='group relative mx-auto h-52 w-36 cursor-pointer md:h-60 md:w-44'>
            <div className='absolute -inset-[0.15rem] h-auto rounded-xl bg-secondary' />
            <div className='relative h-full w-full'>
                <Image
                    className='rounded-xl object-cover object-center shadow-md'
                    src={thumbnailSrc as string}
                    alt={thumbnailAlt}
                    layout='fill'
                />
            </div>
            <div className='absolute inset-x-0 bottom-0 flex h-[25%] flex-col justify-between justify-self-end rounded-xl bg-white bg-opacity-70 backdrop-blur-[2px] transition-all duration-500 ease-in-out group-hover:h-0'>
                <h1 className='p-1 text-sm font-normal text-neutral-800 line-clamp-2 lg:text-base'>
                    {heading}
                </h1>
            </div>
        </div>
    </MyLink>
);

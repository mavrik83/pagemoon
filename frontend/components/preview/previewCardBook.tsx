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
        <div className='group relative mx-auto h-52 w-36 cursor-pointer rounded-xl shadow-even shadow-secondary md:h-60 md:w-44'>
            <div className='relative h-full w-full rounded-xl'>
                <Image
                    className='rounded-xl object-cover object-center'
                    src={thumbnailSrc as string}
                    alt={thumbnailAlt}
                    layout='fill'
                />
            </div>
            <div className='relative'>
                <h1 className='items-center rounded-xl p-1 text-center text-sm font-normal text-neutral-800 line-clamp-2 lg:text-base'>
                    {heading}
                </h1>
                <div className='absolute bottom-1/2 left-1/4 -z-10 h-0 w-1/2 rounded-full shadow-even-bg-sm shadow-secondary' />
            </div>
        </div>
    </MyLink>
);

import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { Review as ReviewModel, Tag } from '@prisma/client';
import parse from 'html-react-parser';
import prisma from '../../lib/prisma';

interface Props {
    review: ReviewModel & {
        tags: Tag[];
        user: {
            firstName: string;
            lastName: string;
        };
    };
}

const BookReview: NextPage<Props> = ({ review }: Props) => {
    const [createdAt, setCreatedAt] = React.useState<string | null>(
        review.createdAt?.toUTCString() as string,
    );

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCreatedAt(review.createdAt!.toDateString());
        }, 500);

        return () => clearInterval(interval);
    }, [review.createdAt]);

    return (
        <article className='mx-auto max-w-2xl space-y-10 px-6 py-24'>
            <div className='mx-auto w-full space-y-4'>
                <h1 className='text-5xl font-normal leading-none'>
                    {review.title}
                </h1>
                <div className='flex flex-wrap space-x-2 text-sm'>
                    {review.tags &&
                        review.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className='inline-flex cursor-pointer items-center justify-self-center rounded-full bg-secondary bg-opacity-30 px-2 py-[0.1rem] text-xs font-light'
                            >
                                {tag.name}
                            </span>
                        ))}
                </div>
                <p className='text-sm'>
                    by
                    <div className='hover:underline'>
                        <span>{`${review.user.firstName} ${review.user.lastName}`}</span>
                    </div>
                    on
                    <time> {createdAt}</time>
                </p>
            </div>
            <div className='prose prose-neutral font-light outline-none prose-h1:hidden prose-h2:text-2xl prose-h2:font-light prose-h3:text-xl prose-h3:font-light prose-p:leading-normal prose-strong:font-extrabold prose-li:leading-none'>
                <p>{parse(review.htmlContent as string)}</p>
            </div>
        </article>
    );
};

export default BookReview;

export const getStaticPaths: GetStaticPaths = async () => {
    const reviews = await prisma.review.findMany({
        select: {
            id: true,
        },
    });

    const paths = reviews.map((review) => ({
        params: { id: review.id },
    }));

    return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const review = await prisma.review.findFirst({
        where: {
            id: params?.id as string,
        },
        include: {
            tags: true,
            user: {
                select: {
                    firstName: true,
                    lastName: true,
                },
            },
        },
    });

    return {
        props: {
            review,
        },
        revalidate: 10,
    };
};

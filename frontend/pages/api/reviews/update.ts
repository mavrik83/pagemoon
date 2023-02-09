import { JSONContent } from '@tiptap/react';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const updateReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await prisma.user
            .findFirst({
                where: {
                    authUid: req.body.userUid,
                },
            })
            .catch(() => {
                throw new Error('User not found');
            });

        const review = await prisma.review
            .update({
                where: { id: req.body.id },
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    rawContent: req.body.rawContent as JSONContent,
                    htmlContent: req.body.htmlContent,
                    status: req.body.status,
                    readTime: req.body.readTime,
                    tags: {
                        set: [],
                        connect: req.body.tagIds?.map((id: string) => ({
                            id,
                        })),
                    },
                    book: {
                        connect: {
                            id: req.body.bookId as string,
                        },
                    },
                },
                include: {
                    book: true,
                    tags: true,
                },
            })
            .catch(() => {
                throw new Error('Failed to update review');
            });

        const currentBookTags = await prisma.book
            .findFirst({
                where: {
                    id: req.body.bookId as string,
                },
                select: {
                    tags: {
                        select: {
                            id: true,
                        },
                    },
                },
            })
            .catch(() => {
                throw new Error('Failed to get book tags');
            });

        const currentBookTagIds = currentBookTags?.tags?.map((tag) => tag.id);

        const newBookTagIds =
            currentBookTagIds && currentBookTagIds.length > 0
                ? req.body.tagIds?.filter((id: string) =>
                      currentBookTagIds.some((tagId) => tagId === id),
                  )
                : req.body.tagIds;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const updateBook = await prisma.book
            .update({
                where: {
                    id: req.body.bookId as string,
                },
                data: {
                    tags: {
                        set: [],
                        connect: newBookTagIds?.map((id: string) => ({
                            id,
                        })),
                    },
                },
            })
            .catch(() => {
                throw new Error('Failed to update book tags');
            });

        const reviewResponse = {
            ...review,
            bookIds: [review?.book?.id],
            tagIds: review?.tags.map((tag) => tag.id),
        };

        res.status(200).send(reviewResponse);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            return updateReview(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

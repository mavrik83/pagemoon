import { JSONContent } from '@tiptap/react';
import { NextApiRequest, NextApiResponse } from 'next';

const createReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
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
            .create({
                data: {
                    title: req.body.title,
                    description: req.body.description,
                    rawContent: req.body.rawContent as JSONContent,
                    htmlContent: req.body.htmlContent,
                    status: req.body.status,
                    readTime: req.body.readTime,
                    tags: {
                        connect: req.body.tagIds?.map((id: string) => ({
                            id,
                        })),
                    },
                    user: {
                        connect: {
                            id: user!.id,
                        },
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
                throw new Error('Failed to create review');
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
            return createReview(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

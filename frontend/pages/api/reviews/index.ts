import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveReviewParams } from '../../../utils/api/reviewApi';

interface ReviewCreatRequest extends NextApiRequest {
    body: SaveReviewParams;
}

const getAllReviews = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const reviews = await prisma.review.findMany().catch(() => {
            throw new Error('failed to get reviews');
        });

        res.send(reviews);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const getSingleReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const review = await prisma.review
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('Review not found');
            });

        res.status(200).send(review);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const upsertReview = async (req: ReviewCreatRequest, res: NextApiResponse) => {
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

        if (!req.body.id) {
            const review = await prisma.review
                .create({
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        rawContent: req.body.rawContent,
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
                })
                .catch(() => {
                    throw new Error('Failed to create review');
                });

            res.status(200).send(review);
        } else {
            const review = await prisma.review
                .update({
                    where: { id: req.body.id },
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        rawContent: req.body.rawContent,
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
                        tagIds: true,
                    },
                })
                .catch(() => {
                    throw new Error('Failed to get book tags');
                });

            const newBookTagIds =
                currentBookTags?.tagIds && currentBookTags?.tagIds?.length > 0
                    ? req.body.tagIds?.filter(
                          (id: string) =>
                              !currentBookTags?.tagIds?.some(
                                  (tagId) => tagId === id,
                              ),
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

            res.status(200).send(review);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const deleteReview = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tags = await prisma.review
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    tags: true,
                },
            })
            .tags();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const review = await prisma.review.update({
            where: {
                id: req.query.id as string,
            },
            data: {
                tags: {
                    disconnect: tags.map((tag) => ({
                        id: tag.id,
                    })),
                },
                user: {
                    disconnect: true,
                },
            },
        });

        const deletedReview = await prisma.review.delete({
            where: {
                id: req.query.id as string,
            },
        });

        res.status(200).send(deletedReview);
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
        case 'GET':
            if (req.query.id) {
                return getSingleReview(req, res);
            }
            return getAllReviews(req, res);
        case 'POST':
            return upsertReview(req, res);
        case 'DELETE':
            return deleteReview(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

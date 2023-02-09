import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const deleteTag = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tag = await prisma.tag
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    books: true,
                    reviews: true,
                },
            })
            .catch(() => {
                throw new Error('Tag not found');
            });

        const updatedTag =
            tag &&
            (await prisma.tag
                .update({
                    where: {
                        id: tag!.id,
                    },
                    data: {
                        books: {
                            disconnect: tag.books.map((book) => ({
                                id: book.id,
                            })),
                        },
                        reviews: {
                            disconnect: tag.reviews.map((review) => ({
                                id: review.id,
                            })),
                        },
                        user: {
                            disconnect: true,
                        },
                    },
                })
                .catch(() => {
                    throw new Error('failed to update tag');
                }));

        const deletedTag =
            updatedTag &&
            (await prisma.tag
                .delete({
                    where: {
                        id: updatedTag.id,
                    },
                })
                .catch(() => {
                    throw new Error('failed to delete tag');
                }));

        res.status(200).send(deletedTag);
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
        case 'DELETE':
            return deleteTag(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const deleteTheme = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const theme = await prisma.theme
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    books: true,
                },
            })
            .catch(() => {
                throw new Error('Theme not found');
            });

        const updatedTheme =
            theme &&
            (await prisma.theme
                .update({
                    where: {
                        id: theme!.id,
                    },
                    data: {
                        books: {
                            disconnect: theme.books.map((book) => ({
                                id: book.id,
                            })),
                        },
                        user: {
                            disconnect: true,
                        },
                    },
                })
                .catch(() => {
                    throw new Error('failed to update theme');
                }));

        const deletedTheme =
            updatedTheme &&
            (await prisma.theme
                .delete({
                    where: {
                        id: updatedTheme.id,
                    },
                })
                .catch(() => {
                    throw new Error('failed to delete theme');
                }));

        res.status(200).send(deletedTheme);
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
            return deleteTheme(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

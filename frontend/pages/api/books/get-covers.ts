import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const book = await prisma.book
            .findMany({
                select: {
                    id: true,
                    coverImage: true,
                },
            })
            .catch(() => {
                throw new Error('Book not found');
            });

        res.status(200).send(book);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

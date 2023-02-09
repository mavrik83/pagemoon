import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getSingleBook = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const book = await prisma.book
            .findFirst({
                where: {
                    id: req.query.id as string,
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getSingleBook(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

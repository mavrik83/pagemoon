import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getBooks = async (_req: NextApiRequest, res: NextApiResponse) => {
    const books = await prisma.book.findMany();
    return res.send(books);
};

const createBook = async (req: NextApiRequest, res: NextApiResponse) => {
    const book = await prisma.book.create({
        data: {
            ...req.body,
        },
    });
    return res.status(200).send(book);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getBooks(req, res);
        case 'POST':
            return createBook(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

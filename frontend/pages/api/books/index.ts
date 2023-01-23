import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveBookParams } from '../../../utils/api/bookApi';

interface BookCreateRequest extends NextApiRequest {
    body: SaveBookParams;
}

const getAllBooks = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const books = await prisma.book
            .findMany({
                orderBy: {
                    title: 'asc',
                },
            })
            .catch(() => {
                throw new Error('failed to get books');
            });

        res.status(200).send(books);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

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

const createBook = async (req: BookCreateRequest, res: NextApiResponse) => {
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

        const book = await prisma.book
            .create({
                data: {
                    title: req.body.title,
                    authors: req.body.authors,
                    isbn: req.body.isbn,
                    language: req.body.language,
                    publisher: req.body.publisher,
                    gradeLevel: req.body.gradeLevel,
                    readingAge: req.body.readingAge,
                    pages: req.body.pages,
                    coverImage: req.body.coverImage,
                    edition: req.body.edition,
                    binding: req.body.binding,
                    synopsis: req.body.synopsis,
                    datePublished: req.body.datePublished,
                    coverLink: req.body.coverLink,
                    themes: {
                        connect: req.body.themeIds?.map((id: string) => ({
                            id,
                        })),
                    },
                    user: {
                        connect: {
                            id: user?.id,
                        },
                    },
                },
            })
            .catch(() => {
                throw new Error('failed to create book');
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
            if (req.query.id) {
                return getSingleBook(req, res);
            }
            return getAllBooks(req, res);
        case 'POST':
            return createBook(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

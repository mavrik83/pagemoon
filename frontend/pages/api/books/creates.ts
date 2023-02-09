import { NextApiRequest, NextApiResponse } from 'next';
import { BookCreateRequest } from '.';
import prisma from '../../../lib/prisma';

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
        case 'POST':
            return createBook(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

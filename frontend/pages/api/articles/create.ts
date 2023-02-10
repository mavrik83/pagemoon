import { JSONContent } from '@tiptap/react';
import { NextApiResponse, NextApiRequest } from 'next';
import { ArticleCreatRequest } from '.';
import prisma from '../../../lib/prisma';

const createArticle = async (
    req: ArticleCreatRequest,
    res: NextApiResponse,
) => {
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

        const article = await prisma.article
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
                    themes: {
                        connect: req.body.themeIds?.map((id: string) => ({
                            id,
                        })),
                    },
                    user: {
                        connect: {
                            id: user!.id,
                        },
                    },
                    books: {
                        connect: req.body.bookIds?.map((id: string) => ({
                            id,
                        })),
                    },
                },
                include: {
                    tags: true,
                    books: true,
                    themes: true,
                },
            })
            .catch(() => {
                throw new Error('Failed to create article');
            });

        const booksInArticle = await prisma.book.findMany({
            where: {
                article: {
                    some: {
                        id: article.id,
                    },
                },
            },
            select: {
                id: true,
                themes: {
                    select: {
                        id: true,
                    },
                },
                tags: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        // update all the books that are in the article with the new tags and themes
        // making sure to leave the other tags and themes in the book but not duplicate them
        await Promise.all(
            booksInArticle.map(async (book) => {
                const newTagIds = Array.from(
                    new Set([
                        ...book.tags.map((tag) => tag.id),
                        ...req.body.tagIds!,
                    ]),
                );
                const newThemeIds = Array.from(
                    new Set([
                        ...book.themes.map((theme) => theme.id),
                        ...req.body.themeIds!,
                    ]),
                );

                await prisma.book.update({
                    where: {
                        id: book.id,
                    },
                    data: {
                        tags: {
                            set: [],
                            connect: newTagIds.map((id) => ({
                                id,
                            })),
                        },
                        themes: {
                            set: [],
                            connect: newThemeIds.map((id) => ({
                                id,
                            })),
                        },
                    },
                });
            }),
        ).catch(() => {
            throw new Error('Failed to update books');
        });

        const articleResponse = {
            ...article,
            bookIds: article?.books.map((book) => book.id),
            tagIds: article?.tags.map((tag) => tag.id),
            themeIds: article?.themes.map((theme) => theme.id),
        };

        res.status(200).send(articleResponse);
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
            return createArticle(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

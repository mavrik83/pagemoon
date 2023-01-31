import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveArticleParams } from '../../../utils/api/articleApi';

interface ArticleCreatRequest extends NextApiRequest {
    body: SaveArticleParams;
}

const getAllArticles = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const articles = await prisma.article.findMany().catch(() => {
            throw new Error('failed to get articles');
        });

        res.send(articles);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const getSingleArticle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const article = await prisma.article
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('Article not found');
            });

        res.status(200).send(article);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const upsertArticle = async (
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

        if (!req.body.id) {
            const article = await prisma.article
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
                })
                .catch(() => {
                    throw new Error('Failed to create article');
                });

            const booksInArticle = await prisma.book.findMany({
                where: {
                    articleIds: {
                        has: article.id,
                    },
                },
                select: {
                    id: true,
                    themeIds: true,
                    tagIds: true,
                },
            });

            // update all the books that are in the article with the new tags and themes
            // making sure to leave the other tags and themes in the book but not duplicate them
            await Promise.all(
                booksInArticle.map(async (book) => {
                    const newTagIds = Array.from(
                        new Set([...book.tagIds, ...req.body.tagIds!]),
                    );
                    const newThemeIds = Array.from(
                        new Set([...book.themeIds, ...req.body.themeIds!]),
                    );

                    await prisma.book.update({
                        where: {
                            id: book.id,
                        },
                        data: {
                            tagIds: {
                                set: newTagIds,
                            },
                            themeIds: {
                                set: newThemeIds,
                            },
                        },
                    });
                }),
            ).catch(() => {
                throw new Error('Failed to update books');
            });

            res.status(200).send(article);
        } else {
            const article = await prisma.article
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
                        themes: {
                            set: [],
                            connect: req.body.themeIds?.map((id: string) => ({
                                id,
                            })),
                        },
                        books: {
                            set: [],
                            connect: req.body.bookIds?.map((id: string) => ({
                                id,
                            })),
                        },
                    },
                })
                .catch(() => {
                    throw new Error('Failed to update article');
                });

            const booksInArticle = await prisma.book.findMany({
                where: {
                    articleIds: {
                        has: article.id,
                    },
                },
                select: {
                    id: true,
                    themeIds: true,
                    tagIds: true,
                },
            });

            // update all the books that are in the article with the new tags and themes
            // making sure to leave the other tags and themes in the book but not duplicate them
            await Promise.all(
                booksInArticle.map(async (book) => {
                    const newTagIds = Array.from(
                        new Set([...book.tagIds, ...req.body.tagIds!]),
                    );
                    const newThemeIds = Array.from(
                        new Set([...book.themeIds, ...req.body.themeIds!]),
                    );

                    await prisma.book.update({
                        where: {
                            id: book.id,
                        },
                        data: {
                            tagIds: {
                                set: newTagIds,
                            },
                            themeIds: {
                                set: newThemeIds,
                            },
                        },
                    });
                }),
            ).catch(() => {
                throw new Error('Failed to update books');
            });

            res.status(200).send(article);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const deleteArticle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tags = await prisma.article
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
        const article = await prisma.article.update({
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

        const deletedArticle = await prisma.article.delete({
            where: {
                id: req.query.id as string,
            },
        });

        res.status(200).send(deletedArticle);
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
                return getSingleArticle(req, res);
            }
            return getAllArticles(req, res);
        case 'POST':
            return upsertArticle(req, res);
        case 'DELETE':
            return deleteArticle(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

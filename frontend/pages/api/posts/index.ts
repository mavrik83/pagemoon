import { Post } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

interface IPostRequest extends NextApiRequest {
    body: IPostReqBody;
}

interface IPostReqBody extends Partial<Post> {
    userUid?: string;
}

const getAllPosts = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const posts = await prisma.post.findMany().catch(() => {
            throw new Error('failed to get posts');
        });

        res.send(posts);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const getSinglePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const post = await prisma.post
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
            })
            .catch(() => {
                throw new Error('Post not found');
            });

        res.status(200).send(post);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const upsertPost = async (req: IPostRequest, res: NextApiResponse) => {
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
            const post = await prisma.post
                .create({
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        rawContent: req.body.rawContent,
                        htmlContent: req.body.htmlContent,
                        status: req.body.status,
                        readTime: req.body.readTime,
                        categories: {
                            connect: req.body.categoryIds?.map(
                                (id: string) => ({
                                    id,
                                }),
                            ),
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
                    throw new Error('Failed to create post');
                });

            res.status(200).send(post);
        } else {
            const post = await prisma.post
                .update({
                    where: { id: req.body.id },
                    data: {
                        title: req.body.title,
                        description: req.body.description,
                        rawContent: req.body.rawContent,
                        htmlContent: req.body.htmlContent,
                        status: req.body.status,
                        readTime: req.body.readTime,
                        categories: {
                            set: [],
                            connect: req.body.categoryIds?.map(
                                (id: string) => ({
                                    id,
                                }),
                            ),
                        },
                        book: {
                            connect: {
                                id: req.body.bookId as string,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new Error('Failed to update post');
                });

            res.status(200).send(post);
        }
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const categories = await prisma.post
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    categories: true,
                },
            })
            .categories();

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const post = await prisma.post.update({
            where: {
                id: req.query.id as string,
            },
            data: {
                categories: {
                    disconnect: categories.map((category) => ({
                        id: category.id,
                    })),
                },
                user: {
                    disconnect: true,
                },
            },
        });

        const deletedPost = await prisma.post.delete({
            where: {
                id: req.query.id as string,
            },
        });

        res.status(200).send(deletedPost);
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
                return getSinglePost(req, res);
            }
            return getAllPosts(req, res);
        case 'POST':
            return upsertPost(req, res);
        case 'DELETE':
            return deletePost(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

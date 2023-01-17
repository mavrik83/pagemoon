import { Category } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

interface ICategoryRequest extends NextApiRequest {
    body: ICategoryReqBody;
}

interface ICategoryReqBody extends Partial<Category> {
    userUid?: string;
}

const getCategories = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const categories = await prisma.category.findMany().catch(() => {
            throw new Error('failed to get categories');
        });

        res.send(categories);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const createCategory = async (req: ICategoryRequest, res: NextApiResponse) => {
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

        const category = await prisma.category
            .create({
                data: {
                    name: req.body.name,
                    user: {
                        connect: {
                            id: user!.id,
                        },
                    },
                },
            })
            .catch(() => {
                throw new Error('failed to create category');
            });
        res.status(200).send(category);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const deleteCategory = async (req: ICategoryRequest, res: NextApiResponse) => {
    try {
        const category = await prisma.category
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    books: true,
                    posts: true,
                },
            })
            .catch(() => {
                throw new Error('Category not found');
            });

        const updatedCategory = await prisma.category
            .update({
                where: {
                    id: category!.id,
                },
                data: {
                    books: {
                        disconnect: category!.books.map((book) => ({
                            id: book.id,
                        })),
                    },
                    posts: {
                        disconnect: category!.posts.map((post) => ({
                            id: post.id,
                        })),
                    },
                    user: {
                        disconnect: true,
                    },
                },
            })
            .catch(() => {
                throw new Error('failed to update category');
            });

        const deletedCategory = await prisma.category
            .delete({
                where: {
                    id: updatedCategory!.id,
                },
            })
            .catch(() => {
                throw new Error('failed to delete category');
            });

        res.status(200).send(deletedCategory);
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
            return getCategories(req, res);
        case 'POST':
            return createCategory(req, res);
        case 'DELETE':
            return deleteCategory(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

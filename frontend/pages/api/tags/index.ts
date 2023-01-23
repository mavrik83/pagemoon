import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveTagParams } from '../../../utils/api/tagApi';

interface TagCreateRequest extends NextApiRequest {
    body: SaveTagParams;
}

const getTags = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tags = await prisma.tag.findMany().catch(() => {
            throw new Error('failed to get tags');
        });

        res.send(tags);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const createTag = async (req: TagCreateRequest, res: NextApiResponse) => {
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

        const tag =
            user &&
            (await prisma.tag
                .create({
                    data: {
                        name: req.body.name,
                        user: {
                            connect: {
                                id: user.id,
                            },
                        },
                    },
                })
                .catch(() => {
                    throw new Error('failed to create tag');
                }));
        res.status(200).send(tag);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send(error.message);
        } else {
            res.status(500).send('Internal server error');
        }
    }
};

const deleteTag = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const tag = await prisma.tag
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
                throw new Error('Tag not found');
            });

        const updatedTag =
            tag &&
            (await prisma.tag
                .update({
                    where: {
                        id: tag!.id,
                    },
                    data: {
                        books: {
                            disconnect: tag.books.map((book) => ({
                                id: book.id,
                            })),
                        },
                        posts: {
                            disconnect: tag.posts.map((post) => ({
                                id: post.id,
                            })),
                        },
                        user: {
                            disconnect: true,
                        },
                    },
                })
                .catch(() => {
                    throw new Error('failed to update tag');
                }));

        const deletedTag =
            updatedTag &&
            (await prisma.tag
                .delete({
                    where: {
                        id: updatedTag.id,
                    },
                })
                .catch(() => {
                    throw new Error('failed to delete tag');
                }));

        res.status(200).send(deletedTag);
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
            return getTags(req, res);
        case 'POST':
            return createTag(req, res);
        case 'DELETE':
            return deleteTag(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

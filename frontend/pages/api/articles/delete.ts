import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

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
        case 'DELETE':
            return deleteArticle(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};
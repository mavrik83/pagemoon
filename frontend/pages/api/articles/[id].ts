import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const getSingleArticle = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const article = await prisma.article
            .findFirst({
                where: {
                    id: req.query.id as string,
                },
                include: {
                    tags: true,
                    books: true,
                    themes: true,
                },
            })
            .catch(() => {
                throw new Error('Article not found');
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
        case 'GET':
            return getSingleArticle(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

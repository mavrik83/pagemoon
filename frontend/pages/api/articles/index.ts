import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveArticleParams } from '../../../utils/api/articleApi';

export interface ArticleCreatRequest extends NextApiRequest {
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

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'GET':
            return getAllArticles(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

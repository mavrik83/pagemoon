import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { SaveThemeParams } from '../../../utils/api/themeApi';

export interface ThemeCreateRequest extends NextApiRequest {
    body: SaveThemeParams;
}

const getThemes = async (_req: NextApiRequest, res: NextApiResponse) => {
    try {
        const themes = await prisma.theme.findMany().catch(() => {
            throw new Error('failed to get themes');
        });

        res.send(themes);
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
            return getThemes(req, res);
        default:
            return res.status(405).json({
                error: `Method ${req.method} not allowed`,
            });
    }
};

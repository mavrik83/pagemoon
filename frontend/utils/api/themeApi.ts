import { Theme } from '@prisma/client';
import { apiRequest } from '../../lib/axios/baseAxios';

export interface SaveThemeParams extends Partial<Theme> {
    userUid?: string;
}

export const themeApi = {
    getThemes: async () => {
        const themes = await apiRequest.get<null, Theme[]>('/api/themes');
        return themes;
    },
    createTheme: async (params: SaveThemeParams) => {
        const newTheme = await apiRequest.post<SaveThemeParams, Theme>(
            '/api/themes',
            params,
        );
        return newTheme;
    },
};

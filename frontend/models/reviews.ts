import { Review } from '@prisma/client';

export interface ReviewPreview extends Partial<Review> {
    user: {
        firstName: string;
    };
    tags: {
        name: string;
    }[];
    book: {
        title: string;
        isbn: string;
        coverImage?: string;
    };
}

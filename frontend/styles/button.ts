import { tv } from 'tailwind-variants';

export const buttonStyles = tv({
    base: 'inline-flex items-center justify-center whitespace-nowrap font-medium rounded-lg shadow-lg hover:scale-105 active:shadow-none active:scale-100',
    variants: {
        color: {
            primary:
                'text-white bg-primary hover:opacity-90 border border-primary',
            secondary:
                'text-neutral-800 bg-secondary bg-opacity-20 border border-secondary hover:opacity-90',
            default:
                'text-white bg-primary hover:opacity-90 border border-primary',
        },
        size: {
            extraSmall: 'text-xs px-2.5 py-1.5',
            small: 'text-sm px-3 py-2',
            medium: 'text-sm px-4 py-2',
            large: 'text-base px-4 py-2',
            extraLarge: 'text-base px-6 py-3',
            default: 'text-base px-4 py-2',
        },
    },
    defaultVariants: {
        color: 'default',
        size: 'default',
    },
});

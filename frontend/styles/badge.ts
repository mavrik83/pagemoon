import { tv } from 'tailwind-variants';

export const badgeStyles = tv({
    base: 'inline-flex cursor-pointer items-center justify-self-center rounded-full text-neutral-800 px-2 py-[0.1rem] font-light',
    variants: {
        color: {
            primary: 'bg-primary bg-opacity-30',
            secondary: 'bg-secondary bg-opacity-30',
            tertiary: 'bg-tertiary bg-opacity-30',
        },
        size: {
            small: 'text-xs',
            medium: 'text-sm',
            large: 'text-base',
        },
    },
    defaultVariants: {
        color: 'primary',
        size: 'small',
    },
});

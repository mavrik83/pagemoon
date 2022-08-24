import React from 'react';
import { classNames, mergeStrings, twc } from '../utils/helpers/classNames';

interface Props {
    children: React.ReactNode;
    twClasses?: string;
    primary?: boolean;
    secondary?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    onClick?: () => void;
}

const Button: React.FC<Props> = ({
    children,
    twClasses = '',
    primary,
    secondary,
    size,
    onClick = () => {},
}) => {
    if (secondary) {
        // eslint-disable-next-line no-param-reassign
        primary = false;
    }

    const btnMode = {
        primary:
            'text-white bg-secondary hover:bg-opacity-90 outline outline-secondary',
        secondary:
            'text-black bg-secondary bg-opacity-20 !outline !outline-secondary hover:opacity-90',
        default:
            'text-white bg-primary hover:opacity-90 outline outline-primary',
    };

    const btnSize = {
        xs: 'text-xs px-2.5 py-1.5',
        sm: 'text-sm px-3 py-2',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-4 py-2',
        xl: 'text-base px-6 py-3',
        default: 'text-base px-4 py-2',
    };

    const baseClasses = twc`
        inline-flex
        items-center
        justify-center
        whitespace-nowrap
        font-medium
        rounded-lg
        shadow-lg
        hover:scale-105
        active:shadow-none
        active:scale-100
        ${primary && btnMode.primary}
        ${secondary && btnMode.secondary}
        ${size ? btnSize[size] : btnSize.default}
        ${!primary && !secondary && btnMode.default}
    `;

    const classes = classNames(mergeStrings(baseClasses, twClasses));

    return (
        <button type="button" className={classes} onClick={onClick}>
            {children}
        </button>
    );
};

Button.defaultProps = {
    twClasses: '',
    primary: false,
    secondary: false,
    size: 'md',
    onClick: () => {},
};

export default Button;

import React from 'react';
import { classNames, mergeStrings, twc } from '../utils/helpers/classNames';

interface Props {
    children: React.ReactNode;
    twClasses?: string;
}

const Container: React.FC<Props> = ({ children, twClasses = '' }) => {
    const baseClasses = twc`
        max-w-7xl
        mx-auto
        min-h-screen
        px-4
        sm:px-6
        lg:px-8
    `;

    const classes = classNames(mergeStrings(baseClasses, twClasses));

    return <div className={classes}>{children}</div>;
};

Container.defaultProps = {
    twClasses: '',
};

export default Container;

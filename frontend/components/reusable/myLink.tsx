import Link from 'next/link';
import React, { ComponentPropsWithRef, forwardRef } from 'react';

export const MyLink = forwardRef((props: ComponentPropsWithRef<any>, ref) => {
    const { href, children, ...rest } = props;
    return (
        <Link href={href}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    );
});

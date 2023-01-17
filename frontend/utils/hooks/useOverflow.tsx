/* eslint-disable consistent-return */
import { useState, useEffect } from 'react';

export const useOverflow = (ref: React.RefObject<HTMLElement>) => {
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) {
            return;
        }

        const handleOverflow = () => {
            setIsOverflowing(element.scrollWidth > element.clientWidth);
        };

        handleOverflow();

        element.addEventListener('resize', handleOverflow);
        return () => {
            element.removeEventListener('resize', handleOverflow);
        };
    }, [ref]);

    return isOverflowing;
};

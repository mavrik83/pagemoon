/**
 * Capitalize the first word of the string
 *
 * capitalize('hello')   -> 'Hello'
 * capitalize('va va voom') -> 'Va va voom'
 */
export const capitalize = (str: string): string => {
    if (!str || str.length === 0) return '';
    const lower = str.toLowerCase();
    return (
        lower.substring(0, 1).toUpperCase() + lower.substring(1, lower.length)
    );
};

/**
 * Formats the given string in title case fashion
 *
 * title('hello world') -> 'Hello World'
 * title('va_va_boom') -> 'Va Va Boom'
 * title('root-hook') -> 'Root Hook'
 * title('queryItems') -> 'Query Items'
 */
export const title = (str: string | null | undefined): string => {
    if (!str) return '';
    return str
        .split(/(?=[A-Z])|[.\-\s_]/)
        .map((s) => s.trim())
        .filter((s) => !!s)
        .map((s) => capitalize(s.toLowerCase()))
        .join(' ');
};

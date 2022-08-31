/**
 * Split an array into two array based on
 * a true/false condition function
 */
export const fork = <T>(
    list: T[],
    condition: (item: T) => boolean,
): [T[], T[]] => {
    if (!list) return [[], []];
    return list.reduce(
        (acc, item) => {
            const [a, b] = acc;
            if (condition(item)) {
                return [[...a, item], b];
            }
            return [a, [...b, item]];
        },
        [[], []] as [T[], T[]],
    );
};

/**
 * An async map function. Works like the
 * built-in Array.map function but handles
 * an async mapper function
 */
export const map = async <T, K>(
    array: T[],
    asyncMapFunc: (item: T) => Promise<K>,
): Promise<K[]> => {
    const result = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const value of array) {
        // eslint-disable-next-line no-await-in-loop
        const newValue = await asyncMapFunc(value);
        result.push(newValue);
    }
    return result;
};

/**
 * Given a list of items returns a new list with only
 * unique items. Accepts an optional identity function
 * to convert each item in the list to a comparable identity
 * value
 */
export const unique = <T, K extends string | number | symbol>(
    array: T[],
    toKey?: (item: T) => K,
): T[] => {
    const valueMap = array.reduce((acc, item) => {
        const key = toKey
            ? toKey(item)
            : (item as any as string | number | symbol);
        if (acc[key]) return acc;
        return { ...acc, [key]: item };
    }, {} as Record<string | number | symbol, T>);
    return Object.values(valueMap);
};

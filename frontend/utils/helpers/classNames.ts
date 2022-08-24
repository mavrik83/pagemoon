/* eslint-disable no-param-reassign */
export const classNames = (...classes: (false | null | undefined | string)[]) =>
    classes.filter(Boolean).join(' ');

// function to split strings into an array, merge them and remove duplicates
export const mergeStrings = (...strings: string[]) =>
    strings
        .reduce((acc: string[], curr) => acc.concat(curr.split(' ')), [])
        .reduce((acc: string[], curr) => {
            if (acc.indexOf(curr) === -1) {
                acc.push(curr);
            }
            return acc;
        }, [])
        .join(' ');

// tag function to accept a TemplateStringsArray and return the string
export const twc = (strings: TemplateStringsArray, ...values: any[]) =>
    strings.reduce((acc: string, curr: string, i: number) => {
        acc += curr;
        if (i < values.length) {
            acc += values[i];
        }
        return acc;
    }, '');

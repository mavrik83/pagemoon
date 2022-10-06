// debounce arrow fucntion wrapper in ts
export const debounce = <TArgs extends any[]>(
    { delay }: { delay: number },
    func: (...args: TArgs) => any,
): ((...args: TArgs) => void) => {
    let timer: any = null;
    const debounced = (...args: TArgs) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };
    return debounced as unknown as (...args: TArgs) => void;
};

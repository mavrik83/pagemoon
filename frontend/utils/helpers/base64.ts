export const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(new Blob([file]));
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
    });

export const processISBN = (isbn: string): string => {
    const pattern =
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$)[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/;

    if (!pattern.test(isbn)) {
        throw new Error('Invalid ISBN format');
    }

    let formattedIsbn = isbn.replace(/[- ]/g, '');
    if (formattedIsbn.length === 10) {
        formattedIsbn = `${formattedIsbn.slice(0, 9)}-${formattedIsbn.slice(
            9,
        )}`;
        formattedIsbn = `[ISBN-10] ${formattedIsbn}`;
    } else {
        formattedIsbn = `${formattedIsbn.slice(0, 12)}-${formattedIsbn.slice(
            12,
        )}`;
        formattedIsbn = `[ISBN-13] ${formattedIsbn}`;
    }
    return formattedIsbn;
};

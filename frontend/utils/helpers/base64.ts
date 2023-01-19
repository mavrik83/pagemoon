export const fileToBase64 = (file: FileList): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
    });

export const processImage = (file: FileList): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file[0]);
        reader.onload = () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let { width } = img;
                let { height } = img;
                const maxWidth = 400;
                const maxHeight = 400;
                let ratio = 0;

                if (width > maxWidth) {
                    ratio = maxWidth / width;
                    canvas.width = maxWidth;
                    canvas.height = height * ratio;
                    height *= ratio;
                    width *= ratio;
                }

                if (height > maxHeight) {
                    ratio = maxHeight / height;
                    canvas.height = maxHeight;
                    canvas.width = width * ratio;
                    width *= ratio;
                }

                ctx!.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL());
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });

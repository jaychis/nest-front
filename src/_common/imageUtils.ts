import Compressor from "compressorjs";

export const ImageUtils = (file: File) => {
    return new Promise<File>((resolve, reject) => {
      new Compressor(file, {
        quality: 0.8,
        mimeType: "image/webp",
        success(result) {
          const convertedFile = new File([result], file.name.replace(/\.\w+$/, ".webp"), {
            type: "image/webp",
            lastModified: Date.now(),
          });
  
          resolve(convertedFile);
        },
        error(err) {
          reject(err);
        },
      });
    });
  };

export type EditMode = 'generate' | 'changeCloth' | 'changeBackground';

// This is a helper function to convert a File object to a base64 string and get its mime type.
// It's placed here to be reusable by services.
export const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

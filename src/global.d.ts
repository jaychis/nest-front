declare global {
    interface Window {
      Kakao: any;
    }
  }

  declare module '*.module.css' {
    const content: { [key: string]: string };
    export = content;
  }

export {};

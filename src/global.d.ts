declare global {
  interface Window {
    Kakao: any;
    adsbygoogle: unknown[];
  }
}

declare module '*.module.css' {
  const content: { [key: string]: string };
  export = content;
}

export {};

import React from 'react';


export const isMobile: boolean = !!navigator.userAgent.match(/Mobi/);

//const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// export const isDev = (): boolean => {
//     return development;
// };

export const getBaseDataUrl = (): string => {
    return "/data/";
}

// export const isFunction = (something: any): boolean => {
//     return something && typeof something === "function";
// };


// export const isArray = (something: any): boolean => {
//     return Array.isArray(something);
// };


export let ensureNumLen = (n: any, digits: number = 2): string => {
    let s = n.toString();
    while (s.length < digits) {
        s = "0" + s;
    }
    return s;
};


export let ensureTextLen = (txt: string, maxLen: number): string => {
    return txt.length > maxLen ? txt.substring(0, maxLen) + "..." : txt;
};


// export const multilineStringToHtml = (s: string): JSX.Element => {
//     const lines = s && s.split("\n").map(v => <div>{v}</div>);
//     return <>
//         {lines}
//     </>
// }


export const openUrl = (url: string): void => {
    if (url) {
        window.open(url, '_blank');
    }
}


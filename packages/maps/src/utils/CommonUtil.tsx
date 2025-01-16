export const isMobile: boolean = !!navigator.userAgent.match(/Mobi/);

export const getBaseDataUrl = (): string => {
    return "/data/";
}

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


export const openUrl = (url: string): void => {
    if (url) {
        window.open(url, '_blank');
    }
}


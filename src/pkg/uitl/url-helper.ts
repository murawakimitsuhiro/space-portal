
export const hostname = (urlStr: string): string => (new URL(urlStr)).hostname
export const pathname = (urlStr: string): string => (new URL(urlStr)).pathname
import { UploadedFile } from "./value-objects/file"

export const newScbPageUrl = (file: UploadedFile): string => {
    const pageTitle = encodeURIComponent(`${file.name}(${file.sourcePageUrl.hostname})`)
    const urlPatterns = Array.from(new Set(urlPattern(file.sourcePageUrl.toString())))
        .sort((a, b) => b.length - a.length)
        .map(url => `[${url}]`)
    const content = `[${file.name} ${file.fileAccessUrl}]
code: meta.json
 ${JSON.stringify(file)}
 
[* links]
 ${urlPatterns.join('\n ')}
`
    return `${currentProjectUrl()}${pageTitle}?body=${encodeURIComponent(content)}` 
}

const currentProjectUrl = ():string => {
    // todo 
    const projName = 'mrwk-space'
    return `https://scrapbox.io/${projName}/`
}

const urlPattern = (url: string): string[] => {
    const domain: string | undefined = url.match(/(?<=[http|https]:\/\/)[^\/]+/g)?.[0]
    if (!domain) return []
    const pathAndParam = url.split(domain)[1].split('?') 
    const pathTokens = pathAndParam[0].split('/').filter(v => v != '')
    const paramTokens = pathAndParam.length > 1 ? pathAndParam[1].split('&').filter(v => v != '') : []
    return (pathTokens.concat(paramTokens)).reduce((acc, token) => {
        const lastPath = acc[acc.length - 1]
        return [...acc, `${lastPath}/${token}`]
    }, [domain])
}
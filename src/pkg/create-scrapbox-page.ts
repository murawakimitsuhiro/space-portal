import { historiesMinutes } from "./history"
import { UploadedFile } from "./value-objects/file"

const referenceHistoryMinute = 15

export const newScbPageUrl = async (file: UploadedFile): Promise<string> => {
    const pageTitle = encodeURIComponent(`${file.name}(${file.sourceUrl.hostname})`)
    // ファイルをダウンロードした場所でカウント
    // const linkList = Array.from(new Set(urlPattern(file.sourcePageUrl.toString())))
    //     .sort((a, b) => b.length - a.length)
    //     .map(url => `[${url}]`)
    const histories = await historyTitles()
    const linkList = histories
        .sort((a, b) => b.length - a.length)
        .map(url => `[${url}]`)

    const content = `[${file.name} ${file.fileAccessUrl}]
code: meta.json
 ${JSON.stringify(file)}
 
[* links]
 ${linkList.join('\n ')}
`
    return `${currentProjectUrl()}${pageTitle}?body=${encodeURIComponent(content)}` 
}

const currentProjectUrl = ():string => {
    // todo 
    const projName = 'mrwk-space'
    return `https://scrapbox.io/${projName}/`
}

const historyTitles = async (): Promise<string[]> => {
    return historiesMinutes(referenceHistoryMinute)
        .then(hs => hs.reduce((acc: string[], item):string[] => {
          return item.title ? [...acc, item.title] : acc
        }, []))
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
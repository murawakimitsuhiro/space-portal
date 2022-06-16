import { getFolders, postNewFile } from "./google-drive"

export const uploadFile = async (url: string) => {
    console.debug('request to ', url)
    const {filename, blob} = await fetchBlob(url)
    console.debug('getted file ', filename, ' type=', blob.type)
    // const encodedData = await encodebase64(blob)
    // console.debug('encoded base64')
    const result = await postNewFile(filename, blob)
    console.debug(result)
}

const urlPattern = (url: string): any => {
    const domain: string | undefined = url.match(/(?<=[http|https]:\/\/)[^\/]+/g)?.[0]
    if (!domain) return []
    const pathTokens = url.split(domain)[1].split('?')[0].split('/').filter(v => v != '')
    return pathTokens.reduce((acc, token) => {
        const lastPath = acc[acc.length - 1]
        return [...acc, `${lastPath}/${token}`]
    }, [domain])
}

const fetchBlob = async (url: string): Promise<{filename: string, blob: Blob}> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const filename = decodeFileNameByHeader(response.headers)
    return { filename, blob }
}

const decodeFileNameByHeader = (headers: Headers): string => {
    const disposition = headers.get('Content-Disposition') ?? ''
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
    const matchesEncoded = /filename\*[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
    return matchesEncoded 
        ? decodeURI(matchesEncoded[1].split("''")[1]) 
        : matches ? matches[0] : 'unknown'
}



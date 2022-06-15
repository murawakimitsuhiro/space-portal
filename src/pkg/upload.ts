import { getFolders } from "./google-drive"

export const uploadFile = async (url: string) => {
    // console.debug('request to ', url)
    // const {filename, blob} = await fetchBlob(url)
    // console.debug('getted file ', filename)
    // const encodedData = await encodebase64(blob)
    // console.debug('encoded base64')
    // const driveUploadResponse = await uploadFileToGoogleDrive(filename, encodedData)
    //     .then((res) => console.debug('success ', res))
    //     .catch((e) => console.debug('failed ', e))
    const result = await getFolders()
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
    const disposition = response.headers.get('Content-Disposition') ?? ''// ?.split('filename=')[1] ?? 'unknownfile'
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
    if (!matches || !matches[1]) return { filename: 'unknownfile', blob }
    const filename = matches[1].replace(/['"]/g, '');
    return { filename, blob }
}
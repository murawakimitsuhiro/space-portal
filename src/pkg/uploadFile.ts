
export const uploadFile = async (url: string) => {
    console.debug('request to ', url)
    // const encodedData = await encodeDataByUrl(url)
    // console.debug(encodedData.length)
}

// 

const urlPattern = (url: string): any => {
    const domain: string | undefined = url.match(/(?<=[http|https]:\/\/)[^\/]+/g)?.[0]
    if (!domain) return []
    const pathTokens = url.split(domain)[1].split('?')[0].split('/').filter(v => v != '')
    return pathTokens.reduce((acc, token) => {
        const lastPath = acc[acc.length - 1]
        return [...acc, `${lastPath}/${token}`]
    }, [domain])
}

const encodeDataByUrl = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    await new Promise(resolve => reader.onload = () => resolve(reader.result))
    return reader.result as string
}

// const res = urlPattern("https://files.sol.sfc.keio.ac.jp/courses/5286/files/344787/course%20files/2022-0613-algsci.pdf?download_frd=1&sf_verifier=eyJ0e")
const res = urlPattern("https://files.sol.sfc.keio.ac.jp/courses/5286/files/344787/course%20files/2022-0613-algsci.pdf")
console.debug(res)

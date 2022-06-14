
export const uploadFile = async (url: string) => {
    console.debug('request to ', url)
    // const encodedData = await encodeDataByUrl(url)
    // console.debug(encodedData.length)

    const response = await fetch('https://scrapbox.io/api/projects')
    console.debug(response.json())
}

// https://files.sol.sfc.keio.ac.jp/courses/5286/files/344787/course%20files/2022-0613-algsci.pdf?download_frd=1&sf_verifier=eyJ0e

const encodeDataByUrl = async (url: string): Promise<string> => {
    const response = await fetch(url)
    const blob = await response.blob()
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    await new Promise(resolve => reader.onload = () => resolve(reader.result))
    return reader.result as string
}
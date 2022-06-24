import { newScbPageUrl } from "./create-scrapbox-page"
import * as gdrive from "./requests/google/google-drive-request"
import { GoogleUploadedFile } from "./value-objects/file"


export const uploadFileAndOpenScrapbox = async (fileUrl: string, pageUrl: string) => {
    const uploaded = await downloadAndUploadFile(fileUrl)
        .catch(e => {throw `upload error ${e}`})
    // const { id, name } = uploaded
    // const fileData = new GoogleUploadedFile(id, name, new URL(pageUrl), new URL(pageUrl))
    // const scbNewPageUrl = await newScbPageUrl(fileData)
    // chrome.tabs.create({ url: scbNewPageUrl })
}

const downloadAndUploadFile = async (url: string) => {
    return Promise.all([
        fetchBlob(url),
        gdrive.findOrCreateSpaceFolder()
    ]).then(([{filename, blob}, folderId]) => {
        console.debug('upload pre', filename, folderId)
    })
    // return await gdrive.postNewFile(filename, blob)
    // return {id: 'hfefad2', name: 'feklajfladk3'}
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
        : matches ? matches[1].replace(/^"(.*)"$/, '$1') : 'unknown'
}



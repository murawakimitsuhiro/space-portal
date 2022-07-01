import { newScbPageUrl } from "./create-scrapbox-page"
import * as gdrive from "./requests/google/google-drive-request"
import { UserSettings } from "./user-settings"
import { GoogleUploadedFile } from "./value-objects/file"


export const uploadFileAndOpenScrapbox = async (fileUrl: string, pageUrl: string) => {
    const scbProjectName = await UserSettings.currentProjetName.get()
    if (!scbProjectName) {
        chrome.tabs.create({ url: 'popup.html' })
        return
    }
    const uploaded = await downloadAndUploadFile(fileUrl)
        .catch(e => {throw `upload error ${e}`})
    const { id, name } = uploaded
    const fileData = new GoogleUploadedFile(id, name, new URL(pageUrl), new URL(pageUrl))
    const scbNewPageUrl = await newScbPageUrl(fileData)
    chrome.tabs.create({ url: scbNewPageUrl })
}

const downloadAndUploadFile = async (url: string) => {
    return Promise.all([
        fetchBlob(url),
        gdrive.findOrCreateSpaceFolder()
    ]).then(([{filename, blob}, folderId]) => {
        return gdrive.postNewFile(filename, folderId, blob)
    })
    // return {id: 'hfefad2', name: 'feklajfladk3'}
}

const fetchBlob = async (url: string): Promise<{filename: string, blob: Blob}> => {
    const response = await fetch(url).catch(e => { throw 'response error' + e })
    const blob = await response.blob().catch(e => { throw 'blob error' + e })
    const splited = url.split('/')
    const filename = decodeFileNameByHeader(response.headers) || splited.slice(-1)[0]
    return { filename, blob }
}

const decodeFileNameByHeader = (headers: Headers): string | null => {
    const disposition = headers.get('Content-Disposition') ?? ''
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)
    const matchesEncoded = /filename\*[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition)

    const encodedFileName = matchesEncoded ? decodeURI(matchesEncoded[1].split("''")[1]) : null
    const filename = matches ? matches[1].replace(/^"(.*)"$/, '$1') : null

    if (!filename && !encodedFileName) console.error('File name couldn\'t find. Content-Dispositon = ', disposition)
    return encodedFileName || filename
}



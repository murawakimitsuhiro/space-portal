import { getGoogleToken } from "./google-auth"

const baseUrl = 'https://www.googleapis.com/drive/v3/'
const spaceFolderId = '1B319-6XlHCTbsq0aFWZVHY74QSAblemm' // todo: hard coding

export const getFolders = async () => {
    return requestDriveAPI('folders')
}

export const postNewFile = async (filename: string, blob: Blob) => {
    const metadata = {
        name: filename,
        mineType: blob.type,
        parents: [spaceFolderId]
    }

    const body = new FormData()
    // body.append('name', filename)
    // body.append('mimeType', blob.type)
    // body.append('parents', '[' + spaceFolderId + ']')
    body.append('metadata', JSON.stringify(metadata))
    body.append('file', blob)

    return requestDriveAPI('files', { uploadType: "multipart" }, body)
}

const requestDriveAPI = async (path: string, params: any | null = null, body: any = null) => {
    const accessToken = await getGoogleToken()
    const endpoint = new URL(`https://www.googleapis.com/drive/v3/${path}`)
    const paramStr = params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : ''
    return fetch(endpoint + paramStr, {
        method: body ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: body,
    })
    .then(r => r.json())
}


// GAS経由でpostしていた時のもの
// const uploadFileToGoogleDrive = async (title: string, encodedData: string): Promise<any> => {
//     const postUrl = 'https://script.google.com/macros/s/AKfycbxGPTb3Vcb9p2N7T8ZHgnJkvxhXVFFfc5R8wmGkBrTasFMnptwKG6rWk5x9bqjVKD3RbA/exec'
//     const postedfile = await fetch(postUrl, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ title: title, data: encodedData }),
//     })
//     return postedfile
// }
import { getGoogleToken } from "./google-auth"

const baseUrl = 'https://www.googleapis.com/drive/v3/'

export const getFolders = async () => {
    return requestDriveAPI('files')
}

// export const postNewFile = async () => {
//     const accessToken = await getGoogleToken()
//     const endpoint = new URL(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`)
// }

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
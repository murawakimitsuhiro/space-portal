import { getGoogleToken } from "./google-auth"

export const getFolders = async () => {
    const accessToken = await getGoogleToken()
    return fetch(`https://www.googleapis.com/drive/v3/about?fields=user&access_token=${accessToken}`)
        .then(res => res.json())
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
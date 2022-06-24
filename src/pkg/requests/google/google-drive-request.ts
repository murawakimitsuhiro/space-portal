import { authGoogle, getGoogleToken } from "./google-auth"

const baseUrl = 'https://www.googleapis.com/drive/v3/'
const spaceFolderId = '1B319-6XlHCTbsq0aFWZVHY74QSAblemm' // todo: hard coding

export interface GDriveFile {
    id: string
    kind: string
    mimeType: string
    name: string
}

export interface FilesResponse {
    files: GDriveFile[]
    incompleteSearch: boolean
}

export const postNewFile = async (filename: string, blob: Blob, retry = 3): Promise<GDriveFile> => {
    const accessToken = await getGoogleToken()
    const metadata = {
        name: filename,
        mineType: blob.type,
        parents: [spaceFolderId]
    }

    const body = new FormData()
    body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    body.append('file', blob)

    const options = {
        method: 'POST',
        body: body,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    }

    return fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, options)
        .then(retry > 0 ? validAuthError(postNewFile(filename, blob, --retry)) : r => r)
}

export const getSpaceFolderId = async () => {
    return requestDriveAPI('files', {
        q: "name = 'Space' and mimeType = 'application/vnd.google-apps.folder' and parents in 'root'"
    })
}

const requestDriveAPI = async (path: string, params: any | null = null, body: any = null, retry = 3)
    : Promise<FilesResponse> => {
    const accessToken = await getGoogleToken()
    const endpoint = new URL(baseUrl + path)
    const paramStr = params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : ''
    return fetch(endpoint + paramStr, {
        method: body ? 'POST' : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: body,
    })
    .then(retry > 0 ? validAuthError(requestDriveAPI(path, params, body, --retry)) : r => r)
}

const validAuthError = <T>(retryFunc: Promise<T>) => async (res: Response) => {
    if (res.ok) return res.json()
    if (res.status == 401) {
        const _ = await authGoogle()
        return await retryFunc
    }
    throw new Error(res.statusText);
}
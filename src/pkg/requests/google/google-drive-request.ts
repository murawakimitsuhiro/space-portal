import { authGoogle, getGoogleToken } from "./google-auth"

const baseUrl = 'https://www.googleapis.com/drive/v3/'

interface GoogleApiResponse {}

export interface GDriveFile extends GoogleApiResponse {
    id: string
    kind: string
    mimeType: string
    name: string
}

export interface FilesResponse extends GoogleApiResponse {
    files: GDriveFile[]
    incompleteSearch: boolean
}

export const postNewFile = async (filename: string, folderId: string, blob: Blob, retry = 3): Promise<GDriveFile> => {
    const accessToken = await getGoogleToken()
    const metadata = {
        name: filename,
        mineType: blob.type,
        parents: [folderId]
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
        .then(retry > 0 ? validAuthError(() => postNewFile(filename, folderId, blob, --retry)) : r => r)
}

export const findOrCreateSpaceFolder = async (): Promise<string> => {
    const alreadySpaceFolder = (await searchSpaceFolderId()).files[0]
    if (alreadySpaceFolder) return alreadySpaceFolder.id
    return createSpaceFolder().then(folder => folder.id)
}

const searchSpaceFolderId = async (): Promise<FilesResponse> => {
    const q = `parents in 'root' 
        and name = 'Space'
        and mimeType = 'application/vnd.google-apps.folder'
        and trashed = false`
    return requestDriveAPI<FilesResponse>('files', {
        q: encodeURIComponent(q)
    })
}

const createSpaceFolder = async (retry = 3): Promise<GDriveFile> => {
    const metadata = {
        name: 'Space',
        mimeType: 'application/vnd.google-apps.folder',
    }
    return requestDriveAPI('files', null, JSON.stringify(metadata))

    // return fetch("https://www.googleapis.com/drive/v3/files", {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json' ,
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${accessToken}`,
    //     },
    //     body: '{"mimeType":"application/vnd.google-apps.folder","name":"test folder"}'  
    // }) 
    // .then(r => r.json())

    // return requestDriveAPI('files', null, JSON.stringify(metadata))

    // const body = new FormData()
    // body.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))

    // const options = {
    //     method: 'POST',
    //     body: body,
    //     headers: {
    //         'Authorization': `Bearer ${accessToken}`,
    //     },
    // }
    // return fetch(`https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`, options)
    //     .then(retry > 0 ? validAuthError(createSpaceFolder(--retry)) : r => r)
}

const requestDriveAPI = <T extends GoogleApiResponse>
    (path: string, params: any | null = null, body: any = null, retry = 3)
    : Promise<T> => {
    const endpoint = new URL(baseUrl + path)
    const paramStr = params ? '?' + Object.keys(params).map(key => key + '=' + params[key]).join('&') : ''
    return getGoogleToken()
        .then(token => {
            return fetch(endpoint + paramStr, {
                method: body ? 'POST' : 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: body,
            })
        })
        .then(retry > 0 ? validAuthError(() => requestDriveAPI(path, params, body, --retry)) : r => r)
}

const validAuthError = <T>(retryFunc: () => Promise<T>) => (res: Response) => {
    if (res.ok) return res.json()
    if (res.status === 401) return authGoogle().then(_ => retryFunc)
    throw new Error(res.statusText);
}
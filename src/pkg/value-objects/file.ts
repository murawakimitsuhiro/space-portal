export type FileUploadLocation = "GoogleDrive" | "Dropbox" | "AWSS3"

export interface UploadedFile {
    id: string
    name: string
    location: FileUploadLocation
    sourceUrl: URL
    fileAccessUrl: string
}

export class GoogleUploadedFile implements UploadedFile {
    id: string
    name : string
    location: FileUploadLocation
    sourceUrl: URL

    constructor(id: string, name: string, sourceUrl: URL) {
        this.id = id
        this.name = name
        this.location = "GoogleDrive"
        this.sourceUrl = sourceUrl
    }

    get fileAccessUrl(): string {
        return `https://drive.google.com/open?id=${this.id}`
    }
}
export interface ScbProject {
    id: string
    name: string
    displayName: string
    gyazoTeamsName: null
    isMember: boolean
    plan: string
    publicVisible: boolean
    updated: number
}

export const getProjects = async (): Promise<ScbProject[]> => {
    const response = await fetch('https://scrapbox.io/api/projects')
    return response.json()
}
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
    return fetch('https://scrapbox.io/api/projects')
        .then(r => {
            if (!r.ok) throw 'faild to get scrapbox projects'
            return r.json().then(json => json.projects)
        })
}
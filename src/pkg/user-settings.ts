export const currentProjetNameStorage = {
    get: async (): Promise<string> => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['selected_project_id'], r => resolve(r.selected_project_id))
        })
    },
    set: async (value: string) => {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ selected_project_id: value }, () => resolve(value))
        })
    },
}
export interface ChromeStorageAccesser<T> {
    get: () => Promise<T>
    set: (value: T) => Promise<T>
}

export const chromeStorageAccess = <T>(key: string): ChromeStorageAccesser<T> => {
    return {
        get: async (): Promise<T> => {
            return new Promise((resolve) => {
                chrome.storage.sync.get([key], r => resolve(r[key]))
            })
        },
        set: async (value: T) => {
            return new Promise((resolve) => {
                chrome.storage.sync.set({ [key]: value }, () => resolve(value))
            })
        }
    }
}

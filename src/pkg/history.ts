import { flatMapAsync } from "./uitl/promise-map";

export const historiesMinutes = async (minutes: number): Promise<chrome.history.HistoryItem[]> => {
    const microsecondsMinutes = 1000 * 60 * minutes
    const searchTime = (new Date).getTime() - microsecondsMinutes
    const numRequestsOutstanding = 0;

    return new Promise<chrome.history.HistoryItem[]>((resolve, reject) => {
        chrome.history.search({ 'text': '', 'startTime': searchTime }, resolve)
    })
    // .then(hs => flatMapAsync(hs, async i => allVisits({url: i.url!})))
}

const allVisits = async (url: chrome.history.Url):Promise<chrome.history.VisitItem[]> => {
    return new Promise((resolve, reject) => {
        chrome.history.getVisits(url, resolve)
    })
}
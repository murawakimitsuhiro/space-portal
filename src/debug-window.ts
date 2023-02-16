export function openDebugWindow(){
    const debugHtml = chrome.runtime.getURL('screenshot.html')
    chrome.windows.create({
        url: debugHtml,
        type: 'popup'
    }, (w) => {
        const tabs = w?.tabs
        if (tabs) {
            chrome.runtime.sendMessage({ type: 'DebugWindow', tabId: tabs[0].id })
        }
    })
}

console.debug('debug window')

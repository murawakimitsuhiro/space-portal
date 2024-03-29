'use strict';

import { historiesMinutes } from "./pkg/history";
import { findOrCreateSpaceFolder } from "./pkg/requests/google/google-drive-request";
import { uploadFileAndOpenScrapbox } from "./pkg/upload";
import { UserSettings } from "./pkg/user-settings";
import tabId = chrome.devtools.inspectedWindow.tabId;

const eventContextMenuType = {
  UploadToSpace: 'uploadToSpace',
} as const

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    contexts: ['link'],
    id: eventContextMenuType.UploadToSpace,
    title: 'リンク先のファイルを空間にアップロード'
  });
});

chrome.contextMenus.onClicked.addListener(item => {
  switch(item.menuItemId) {
    case eventContextMenuType.UploadToSpace:
      if (item.linkUrl) uploadFileAndOpenScrapbox(item.linkUrl, item.pageUrl)
  }
});

let debugWindowTabId = 0

// 5sec 事にスクリーンショットを撮る
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.type === 'GREETINGS') {
    // const message: string = `Hi ${
    //     sender.tab ? 'Con' : 'Pop'
    // }, my name is Bac. I am from Background. It's great to hear from you.`;
    // // Log message coming from the `request` parameter
    // console.debug(request.payload.message);
    // // Send a response message
    // sendResponse({
    //   message,
    // });
  // }

  switch(request.type) {
    case 'DebugWindow':
      debugWindowTabId = request.tabId
      console.debug(debugWindowTabId)
      return
    case 'Screenshot':
      chrome.tabs.captureVisibleTab((screenshotUrl) => {
        // chrome.scripting.executeScript({
        //   target: { tabId: debugWindowTabId, allFrames: true },
        //   func: setScreenshotUrl,
        //   args: [screenshotUrl]
        // })
      })
      return
    default:
      console.debug('receive message', request)
  }
});

function setScreenshotUrl(url: string) {
  const target = document.getElementById('target') as HTMLImageElement
  if (target) {
    target.src = url;
  }
}

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({"url": "screenshot.html" });
});

// let id = 100;
// chrome.browserAction.onClicked.addListener(() => {
//   chrome.tabs.captureVisibleTab((screenshotUrl) => {
//     const viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
//     let targetId = null;
//     chrome.tabs.create({url: viewTabUrl}, (tab) => {
//       targetId = tab.id;
//     });
//     chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
//       if (tabId != targetId || changedProps.status != "complete")
//         return;
//       chrome.tabs.onUpdated.removeListener(listener);
//       const views = chrome.extension.getViews();
//       for (let i = 0; i < views.length; i++) {
//         let view = views[i];
//         if (view.location.href == viewTabUrl) {
//           view.setScreenshotUrl(screenshotUrl);
//           break;
//         }
//       }
//     });
//   });
// });

'use strict';

import { historiesMinutes } from "./pkg/history";
import { getSpaceFolderId } from "./pkg/requests/google/google-drive-request";
import { uploadFileAndOpenScrapbox } from "./pkg/upload";
import { UserSettings } from "./pkg/user-settings";

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

const eventContextMenuType = {
  UploadToSpace: 'uploadToSpace'
} as const

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message: string = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.debug(request.payload.message);

    // getSpaceFolderId()
    //   .then(res => console.debug('response space ', res))
    //   .catch(e => console.debug('error ', e))

    UserSettings.currentProjetName.get().then(name => console.debug('name is ', name))

    // Send a response message
    sendResponse({
      message,
    });
  }
});

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
    default:
      return
  }
});

'use strict';

import { UserSettings } from "./pkg/user-settings";

import Tesseract from 'tesseract.js';
import html2canvas from 'html2canvas';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';

const captureAndOCR = async () => {
    const canvas = await html2canvas(
        document.body,
        {
            allowTaint: true,
            width: window.innerWidth,
            height: window.innerHeight,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            x: window.scrollX,
            y: window.scrollY,
            imageTimeout: 1,
            useCORS: true,
        })

    const base64image = canvas.toDataURL("image/png");
    // window.location.href = base64image
    console.debug(base64image)


    // const { createWorker } = Tesseract;
    // const worker = await createWorker();
    // await worker.loadLanguage('jpn');
    // await worker.initialize('jpn');
    // const { data: { text } } = await worker.recognize(canvas);
    // console.debug('test is ', text)
}

// setTimeout(()=>{
//     captureAndOCR()
// }, 10000)


// setInterval(()=>{
//     html2canvas(
//         document.body,
//         {
//             allowTaint: true,
//             width: window.innerWidth,
//             height: window.innerHeight,
//             scrollX: window.scrollX,
//             scrollY: window.scrollY,
//             x: window.scrollX,
//             y: window.scrollY,
//             imageTimeout: 1,
//         })
//         .then(function(canvas) {
//             // document.body.appendChild(canvas);
//             canvas.toBlob()
//             // Tesseract.recognize(
//             //     canvas,
//             //     'jpn',
//             //     { logger: m => console.log(m) }
//             // ).then(({ data: { text } }) => {
//             //     console.debug(text);
//             // })
//         });
// }, 5000)


// DOMの動きを監視
// const observer = new MutationObserver(async () => {
//   console.log('loaded scrapbox ', location.href)
//   const spaceScbId = await UserSettings.currentProjetName.get()
//   console.log('current selected ', spaceScbId)
// })
// observer.observe(document, { childList: true, subtree: true });
//
// console.debug('hello')

// Communicate with background file by sending a message
// chrome.runtime.sendMessage(
//   {
//     type: 'GREETINGS',
//     payload: {
//       message: 'Hello, my name is Con. I am from ContentScript.',
//     },
//   },
//   response => {
//     console.log(response.message);
//   }
// );

setInterval(() => {
    chrome.runtime.sendMessage({ type: 'Screenshot'})
}, 5000)


// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  sendResponse({});
  return true;
});

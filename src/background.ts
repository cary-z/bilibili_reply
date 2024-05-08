// import hotReload from './libs/hotReload'
// hotReload()

// chrome.runtime.onConnect.addListener(function (externalPort) {
//   console.log(externalPort)
//   externalPort.onDisconnect.addListener(function () {
//     const ignoreError = chrome.runtime.lastError
//     console.log('onDisconnect')
//   })
// })

// chrome.runtime.onInstalled.addListener(function () {
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
//     chrome.declarativeContent.onPageChanged.addRules([
//       {
//         conditions: [
//           // 特殊页面展示 popup
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlContains: '.' }
//           }),
//           new chrome.declarativeContent.PageStateMatcher({
//             pageUrl: { urlContains: '.' }
//           })
//         ],
//         actions: [
//           // new chrome.declarativeContent.SetIcon({ path: './logo.png' }),
//           new chrome.declarativeContent.ShowPageAction()
//         ]
//       }
//     ])
//   })
// })

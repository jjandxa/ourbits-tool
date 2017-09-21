// 定义全局变量
window.shuntData = []
window.saveData = []
window.releaseData = []
window.tabId = null
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { // eslint-disable-line
  if (changeInfo.status === 'complete') {
    if (tab.url.indexOf('ourbits.club') > -1) {
      window.tabId = tabId
      chrome.pageAction.show(tabId) // eslint-disable-line
    } else {
      chrome.pageAction.hide(tabId) // eslint-disable-line
    }
  }
})

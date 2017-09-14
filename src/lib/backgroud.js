chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { // eslint-disable-line
  if (changeInfo.status === 'complete') {
    if (tab.url.indexOf('ourbits.club/rescue.php') > 0) {
      chrome.pageAction.show(tabId) // eslint-disable-line
    } else {
      chrome.pageAction.hide(tabId) // eslint-disable-line
    }
  }
})
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) { // eslint-disable-line
  window.tableData = request
  console.log('success')
})

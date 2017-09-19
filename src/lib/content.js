var $ = require('jquery')
// 发送数据给插件
// chrome.extension.sendRequest(torrents); // eslint-disable-line

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) { // eslint-disable-line
  console.log(`接收事件-${request.type}`)
  if (request.type === 'shunt' && window.location.href.indexOf('rescue.php') > 0) {
    // 读取保种页内容
    console.log('开始读取保种页内容')
    let torrents = loadRescueData()
    sendResponse({
      code: 0,
      message: 'success',
      data: torrents
    })
  } else if (request.type === 'release' && window.location.href.indexOf('userdetails.php') > 0) {
    if ($('#pica').attr('class') !== 'minus') {
      sendResponse({
        code: -1,
        message: '请展开发布种子列表'
      })
    } else {
      console.log('开始读取发布种子列表')
      let torrents = loadReleaseData()
      sendResponse({
        code: 0,
        message: 'success',
        data: torrents
      })
    }
  } else if (request.type === 'save' && window.location.href.indexOf('userdetails.php') > 0) {
    if ($('#pica1').attr('class') !== 'minus') {
      sendResponse({
        code: -1,
        message: '请展开当前做种列表'
      })
    } else {
      console.log('开始读取做种列表')
      let torrents = loadSaveData()
      sendResponse({
        code: 0,
        message: 'success',
        data: torrents
      })
    }
  }
})

// 获取保种页内容
function loadRescueData () {
  // 获取种子列表
  var rows = $('#torrenttable > tbody').children('[class="sticky_blank"]')
  return convertRowsToData(rows)
}

// 获取个人信息页的做种列表
function loadSaveData () {
  var rows = $('#ka1 tbody').children('tr:gt(0)')
  return convertRowsToData2(rows)
}

// 获取个人信息页的发布列表
function loadReleaseData () {
  var rows = $('#ka tbody').children('tr:gt(0)')
  return convertRowsToData2(rows)
}

function convertRowsToData (rows) {
  // 转换数据
  var torrents = []
  for (var i = 0; i < rows.length; i++) {
    var header = $(rows[i]).find('td[class="embedded"] > a')
    var id = getParam($(header).attr('href'), 'id')
    var title = $(header).attr('title')
    var size = computedSize($(rows[i]).children(':eq(4)').text().replace('<br>', ''))
    var seed = $(rows[i]).children(':eq(5)').find('a').text()
    var progress = $(rows[i]).children(':eq(8)').text()
    var status = $(rows[i]).find('td[class="embedded"] > div.doing')
    torrents.push({
      id: id,
      title: title,
      size: size,
      seed: seed,
      progress: progress,
      status: status.length > 0 ? 'doing' : 'out'
    })
  }
  return torrents
}

function convertRowsToData2 (rows) {
  // 转换数据
  var torrents = []
  for (var i = 0; i < rows.length; i++) {
    var header = $(rows[i]).children(':eq(1)').children('a')
    var id = getParam($(header).attr('href'), 'id')
    var title = $(header).attr('title')
    var size = computedSize($(rows[i]).children(':eq(2)').text().replace('<br>', ''))
    var seed = $(rows[i]).children(':eq(3)').text()
    torrents.push({
      id: id,
      title: title,
      size: size,
      seed: seed
    })
  }
  return torrents
}

function computedSize (size) {
  if (size.toUpperCase().indexOf('MB') > 0) {
    let tempSize = size.replace('MB', '')
    return (parseFloat(tempSize) / 1000).toFixed(2)
  } else if (size.toUpperCase().indexOf('GB') > 0) {
    let tempSize = size.replace('GB', '')
    return tempSize
  } else if (size.toUpperCase().indexOf('TB') > 0) {
    let tempSize = size.replace('TB', '')
    return (parseFloat(tempSize) * 1000).toFixed(2)
  }
}

// 获取种子id
function getParam (url, name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = url.split('?')[1].match(reg)
  if (r != null) return decodeURI(r[2]); return null
}

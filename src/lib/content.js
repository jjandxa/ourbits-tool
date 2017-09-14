var $ = require('jquery')
// 获取种子列表
var rows = $('#torrenttable > tbody').children('[class="sticky_blank"]')
// 转换数据
var torrents = []
for (var i = 0; i < rows.length; i++) {
  var header = $(rows[i]).find('td[class="embedded"] > a')
  var id = getParam($(header).attr('href'), 'id')
  var title = $(header).attr('title')
  var size = computedSize($(rows[i]).children(':eq(4)').text().replace('<br>', ''))
  var seed = $(rows[i]).children(':eq(5)').find('a').text()
  var progress = $(rows[i]).children(':eq(8)').text()
  torrents.push({
    id: id,
    title: title,
    size: size,
    seed: seed,
    progress: progress
  })
}

// 发送数据给插件
chrome.extension.sendRequest(torrents); // eslint-disable-line

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

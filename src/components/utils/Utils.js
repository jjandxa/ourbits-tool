import { OfficialGroup } from './Constant'
export default {
  // 排除id方法
  excludeTorrentId (data, excludeData, isExclude) {
    if (isExclude) {
      let oldSeed = excludeData.split('\n')
      return data.filter(item => {
        for (let i = 0; i < oldSeed.length; i++) {
          if (item.id === oldSeed[i]) {
            return false
          }
        }
        return true
      })
    } else {
      return data
    }
  },
  // 生成复制的内容
  getCopyValue (data) {
    let temp = ''
    for (let i = 0; i < data.length; i++) {
      if (i === data.length - 1) {
        temp = temp + `${data[i].id} ${data[i].size}`
      } else {
        temp = temp + `${data[i].id} ${data[i].size}\n`
      }
    }
    return temp
  },
  getCopyWithTorrentValue (data) {
    let temp = ''
    for (let i = 0; i < data.length; i++) {
      if (i === data.length - 1) {
        temp = temp + `${data[i].id} ${data[i].title} ${data[i].type[0]} ${data[i].type[1]} ${data[i].size} ${data[i].seed}`
      } else {
        temp = temp + `${data[i].id} ${data[i].title} ${data[i].type[0]} ${data[i].type[1]} ${data[i].size} ${data[i].seed}\n`
      }
    }
    return temp
  },
  // 排除非官方的种子
  excludeNotOfficial (data, isExclude) {
    if (isExclude) {
      return data.filter(item => {
        for (let i = 0; i < OfficialGroup.length; i++) {
          if (item.title.toUpperCase().indexOf(OfficialGroup[i].toUpperCase()) > -1) {
            return true
          }
        }
        return false
      })
    } else {
      return data
    }
  }
}

<template lang="html">
  <div>
    <el-row>
      <template v-for="seed in finishSeed">
        {{ seed.id + ' ' + seed.size }} <br>
      </template>
    </el-row>
    <el-form :inline="true">
      <el-form-item label="是否排除已报告的种子">
        <el-switch
          on-text="是"
          off-text="否"
          @change="changeEvent"
          v-model="showExclude"
          on-color="#13ce66"
          off-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" id="copy" :data-clipboard-text="copyValue">复制到粘贴板</el-button>
      </el-form-item>
    </el-form>
    <el-row v-show="showExclude">
      <el-input
        type="textarea"
        :rows="4"
        @change="changeEvent"
        placeholder="请输入需要排除的种子 id ，多个 id 以换行区分"
        v-model="exclude">
      </el-input>
    </el-row>
    <el-row>
      <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="id"
            label="id">
          </el-table-column>
          <el-table-column
            prop="size"
            label="大小">
          </el-table-column>
          <el-table-column
            prop="seed"
            label="做种数">
          </el-table-column>
        </el-table>
        <el-row style="text-align: center;">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 50, 100, 200]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-row>
    </el-row>
  </div>
</template>

<script>
var Clipboard = require('clipboard')
export default {
  data () {
    return {
      data: [],
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      showExclude: false,
      exclude: null,
      finishSeed: [],
      copyValue: ''
    }
  },
  mounted () {
    var bg = chrome.extension.getBackgroundPage() // eslint-disable-line
    var self = this
    // 发送获取分流种子列表请求

    chrome.tabs.sendRequest(bg.tabId, { type: 'save' }, response => { // eslint-disable-line
      if (response.code === 0) {
        self.data = response.data
        self.loadTable()
      } else {
        self.$message(response.message)
      }
    })

    // 初始化复制按钮
    new Clipboard('#copy') // eslint-disable-line
  },
  methods: {
    handleSizeChange (val) {
      this.pageSize = val
      this.loadTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadTable()
    },
    loadTable () {
      this.tableData = this.filterData()
    },
    changeEvent () {
      console.log('change')
      this.loadTable()
    },
    filterData () {
      var arr = this.data

      if (this.showExclude) {
        let oldSeed = this.exclude.split('\n')
        arr = arr.filter(item => {
          for (let i = 0; i < oldSeed.length; i++) {
            if (item.id === oldSeed[i]) {
              return false
            }
          }
          return true
        })
      }
      var begin = (this.currentPage - 1) * this.pageSize
      this.total = arr.length
      let temp = ''
      for (let i = 0; i < arr.length; i++) {
        if (i === arr.length - 1) {
          temp = temp + `${arr[i].id} ${arr[i].size}`
        } else {
          temp = temp + `${arr[i].id} ${arr[i].size}\n`
        }
      }
      this.copyValue = temp
      return arr.slice(begin, begin + this.pageSize)
    }
  }
}
</script>

<style lang="css" scoped="">
.el-row {
  margin-top: 5px;
}
.torrent {
  height: 300px;
}
</style>

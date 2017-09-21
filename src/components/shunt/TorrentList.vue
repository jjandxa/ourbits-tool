<template lang="html">
  <div class="torrent">
    <el-row>
      <template v-for="seed in finishSeed">
        {{ seed.id + ' ' + seed.size }} <br>
      </template>
    </el-row>
    <el-form :inline="true">
      <el-form-item label="排除种子">
        <el-switch
          on-text="是"
          off-text="否"
          @change="changeEvent"
          v-model="showExclude"
          on-color="#13ce66"
          off-color="#ff4949">
        </el-switch>
      </el-form-item>
      <el-form-item label="已完成">
        <el-switch
          v-model="query.finish"
          on-text="是"
          off-text="否"
          on-color="#13ce66"
          :width="78"
          @change="changeEvent"
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
          <el-table-column
            prop="progress"
            label="进度">
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
import Utils from '../utils/Utils'
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
      query: {
        finish: false
      },
      copyValue: ''
    }
  },
  mounted () {
    var bg = chrome.extension.getBackgroundPage() // eslint-disable-line
    var self = this
    // 发送获取分流种子列表请求

    chrome.tabs.sendRequest(bg.tabId, { type: 'shunt' }, response => { // eslint-disable-line
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
      // 过滤掉未完成的
      if (this.query.finish) {
        arr = arr.filter(item => item.progress === '100%' && item.status === 'doing')
      }

      // 排除种子ID
      arr = Utils.excludeTorrentId(arr, this.exclude, this.showExclude)

      var begin = (this.currentPage - 1) * this.pageSize
      this.total = arr.length
      // 获取复制的内容
      this.copyValue = Utils.getCopyValue(arr)
      // 分页
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
  min-height: 500px;
}
</style>

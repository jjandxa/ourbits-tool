<template lang="html">
  <div class="torrent">
    <el-row>
      <template v-for="seed in finishSeed">
        {{ seed.id + ' ' + seed.size }} <br>
      </template>
    </el-row>
    <el-form :inline="true">
      <el-row>
        <el-col span="8">
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
        </el-col>
        <el-col span="8">
          <el-form-item label="排除非官方">
            <el-switch
              on-text="是"
              off-text="否"
              @change="changeEvent"
              v-model="excludeNotOfficial"
              on-color="#13ce66"
              off-color="#ff4949">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item label="搜索">
            <el-input v-model="query.title" @change="changeEvent" placeholder="请输入关键词"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col span="8">
          <el-form-item label="类型">
            <el-select v-model="query.type" @change="changeEvent" clearable placeholder="请选择">
              <el-option
                v-for="item in type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item label="媒介">
            <el-select v-model="query.mediaType" @change="changeEvent" clearable placeholder="请选择">
              <el-option
                v-for="item in mediaType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col span="8">
          <el-form-item>
            <el-button type="primary" id="copy" :data-clipboard-text="copyValue">复制到粘贴板</el-button>
          </el-form-item>
        </el-col>
      </el-row>
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
            width="200"
            label="标题">
            <template scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>{{ scope.row.title }}</p>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.title.substring(0, 15) + '...' }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            label="类型" width="200">
            <template scope="scope">
              <el-tag type="primary" v-for="item in scope.row.type"
                style="margin-left: 5px;">{{ item }}</el-tag>
            </template>
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
import { TorrentType, MediaType } from '../utils/Constant'
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
      copyValue: '',
      type: TorrentType,
      mediaType: MediaType,
      query: {
        title: null,
        type: null,
        mediaType: null
      },
      excludeNotOfficial: true
    }
  },
  mounted () {
    var bg = chrome.extension.getBackgroundPage() // eslint-disable-line
    var self = this
    // 发送获取分流种子列表请求

    chrome.tabs.sendRequest(bg.tabId, { type: 'torrent' }, response => { // eslint-disable-line
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
      var self = this
      var arr = this.data

      // 排除种子ID
      arr = Utils.excludeTorrentId(arr, this.exclude, this.showExclude)

      // 排除非官方种子
      arr = Utils.excludeNotOfficial(arr, this.excludeNotOfficial)

      // 过滤标题
      if (this.query.title) {
        arr = arr.filter(item => item.title.indexOf(self.query.title) > -1)
      }

      // 过滤类型
      if (this.query.type) {
        arr = arr.filter(item => item.type[0] === self.query.type)
      }

      if (this.query.mediaType) {
        arr = arr.filter(item => item.type[1] === self.query.mediaType)
      }

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

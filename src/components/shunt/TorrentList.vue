<template lang="html">
  <div>
    <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="id"
          column-key="id"
          label="id">
        </el-table-column>
        <el-table-column
          prop="size"
          column-key="size"
          label="大小">
        </el-table-column>
        <el-table-column
          prop="seed"
          column-key="seed"
          label="做种数">
        </el-table-column>
        <el-table-column
          :filters="[{ text: '已完成', value: '100%' }]"
          :filter-method="filterProgress"
          filter-placement="bottom-end"
          column-key="progress"
          prop="progress"
          label="进度">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10
    }
  },
  mounted () {
    var bg = chrome.extension.getBackgroundPage() // eslint-disable-line
    this.data = bg.tableData
    this.total = this.data.length
    this.tableData = this.data.slice(this.currentPage - 1, this.pageSize)
  },
  methods: {
    filterProgress (value, row) {
      return row.progress === value
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.loadTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.loadTable()
    },
    loadTable () {
      var begin = (this.currentPage - 1) * this.pageSize
      this.tableData = this.data.slice(begin, begin + this.pageSize)
    }
  }
}
</script>

<style lang="css">
</style>

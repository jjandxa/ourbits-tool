<template lang="html">
  <div class="torrent">
    <el-row>
      是否排除已报告的种子:
      <el-switch
        v-model="showExclude"
        on-color="#13ce66"
        off-color="#ff4949">
      </el-switch>
    </el-row>
    <el-row v-show="showExclude">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入需要排除的种子 id ，多个 id 以换行区分"
        v-model="exclude">
      </el-input>
    </el-row>
    <el-row>
      <el-button type="primary" @click="getFinish" style="width:100%;">获取种子 id</el-button>
    </el-row>
    <el-row>
      <template v-for="seed in finishSeed">
        {{ seed.id + ' ' + seed.size }} <br>
      </template>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showExclude: true,
      exclude: null,
      data: [],
      finishSeed: []
    }
  },
  mounted () {
    var bg = chrome.extension.getBackgroundPage() // eslint-disable-line
    this.data = bg.tableData
  },
  methods: {
    getFinish: function () {
      var oldSeed = []
      this.finishSeed = []
      if (this.exclude) {
        oldSeed = this.exclude.split('\n')
      }
      for (var i = 0; i < this.data.length; i++) {
        if (this.data[i].progress === '100%') {
          if (oldSeed.length > 0) {
            if (!this.isOld(this.data[i].id, oldSeed)) {
              this.finishSeed.push({
                id: this.data[i].id,
                size: this.data[i].size
              })
            }
          } else {
            this.finishSeed.push({
              id: this.data[i].id,
              size: this.data[i].size
            })
          }
        }
      }
      console.log(this.finishSeed)
    },
    isOld: function (id, oldSeed) {
      for (var y = 0; y < oldSeed.length; y++) {
        if (id === oldSeed[y]) {
          return true
        }
      }
      return false
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

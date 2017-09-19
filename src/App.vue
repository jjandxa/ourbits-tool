<template>
  <div id="app">
    <el-menu theme="dark" :router="true" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/shunt/torrent/list">分流</el-menu-item>
      <el-menu-item index="/save/torrent/list">保种</el-menu-item>
      <el-menu-item index="/release/torrent/list">发布</el-menu-item>
      <el-submenu index="3">
        <template slot="title">更多</template>
        <el-menu-item index="/about">关于</el-menu-item>
      </el-submenu>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 2px;
}
#app {
  width: 600px;
}
.el-menu-demo {
  width: 100%;
}
</style>

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TorrentId from '@/components/shunt/TorrentId'
import TorrentList from '@/components/shunt/TorrentList'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/shunt/torrentid',
      name: 'TorrentId',
      component: TorrentId
    },
    {
      path: '/shunt/torrentlist',
      name: 'TorrentList',
      component: TorrentList
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})

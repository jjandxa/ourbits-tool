import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import ShuntTorrentList from '@/components/shunt/TorrentList'
import ReleaseTorrentList from '@/components/release/TorrentList'
import SaveTorrentList from '@/components/save/TorrentList'
import TorrentList from '@/components/torrent/TorrentList'
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
      path: '/shunt/torrent/list',
      name: 'ShuntTorrentList',
      component: ShuntTorrentList
    },
    {
      path: '/release/torrent/list',
      name: 'ReleaseTorrentList',
      component: ReleaseTorrentList
    },
    {
      path: '/save/torrent/list',
      name: 'SaveTorrentList',
      component: SaveTorrentList
    },
    {
      path: '/torrent/list',
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

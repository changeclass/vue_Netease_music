<template>
  <!-- 歌单页面 -->
  <div>
    {{ $route.params.id }}
    <i-table :columns="columns" :data="musicList" ellipsis height="600">
      <template slot-scope="{ row }" slot="singal">
        {{ row.ar[0].name }}
      </template>
      <template slot-scope="{ row }" slot="album">
        {{ row.al.name }}
      </template>
    </i-table>
  </div>
</template>

<script>

import { reqMusicListDetail, reqMusicDetail } from '../../api'
export default {

  created () {
    this.initList()
  },
  data () {
    return {
      columns: [
        { type: 'index' },
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: '歌手',
          key: 'singal',
          slot: 'singal'
        },
        {
          title: '专辑',
          key: 'album',
          slot: 'album'
        }],
      musicList: []
    }
  },
  methods: {
    async initList () {
      const listId = this.$route.params.id
      const result = await reqMusicListDetail(listId) // 获取歌单详情
      // 返回的歌单实体不完整，但ID是完整的，因此需要利用id请求歌曲获得歌曲详情
      const trackIds = result.playlist.trackIds
      const ids = []
      for (const item of trackIds) {
        ids.push(item.id)
      }
      console.log(ids.toString())
      const musicLists = await reqMusicDetail(ids.toString())
      console.log(musicLists)
      this.musicList = musicLists.songs
    }
  }
}
</script>

<style>
</style>

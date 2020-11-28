<template>
  <!-- 歌单页面 -->
  <div class="playlist-info">
    <div class="playlist-top">
      <img
        :src="playListInfo.coverImgUrl"
        style="width: 230px; height: 230px"
      />
      <div class="playlist-top-right">
        <Tag color="rgb(236, 65, 65)" type="border">歌单</Tag>
        <h2>{{ playListInfo.name }}</h2>
        <div class="playlist-top-right-user">
          <Avatar :src="playListInfo.creator.avatarUrl" />
          <span style="margin-left: 10px; line-height: 30px; height: 32px">{{
            playListInfo.creator.nickname
          }}</span>
        </div>
        <div class="playlist-top-right-btn">
          <Button
            size="large"
            icon="md-play"
            shape="circle"
            type="error"
            @click="playAll"
            >播放全部</Button
          >
          <Button size="large" icon="md-play" shape="circle">收藏</Button>
          <Button size="large" icon="md-play" shape="circle">分享</Button>
          <Button size="large" icon="md-play" shape="circle">下载全部</Button>
        </div>
        <p>标签：{{ playListInfo.tags | formatTags }}</p>
        <p>
          歌曲：{{ playListInfo.trackCount }} 播放：{{ playListInfo.playCount }}
        </p>
        <p>简介：{{ playListInfo.description }}</p>
      </div>
    </div>
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
        { type: 'index', width: 75 },
        {
          title: 'Name',
          key: 'name',
          width: 350
        },
        {
          title: '歌手',
          key: 'singal',
          slot: 'singal',
          width: 100
        },
        {
          title: '专辑',
          key: 'album',
          slot: 'album'
        }],
      musicList: [],
      playListInfo: {
        coverImgUrl: '',
        name: '',
        creator: {
          nickname: '',
          avatarUrl: '',
          userId: 0
        },
        tags: [],
        trackCount: 0,
        playCount: 0,
        description: ''
      }
    }
  },
  filters: {
    formatTags: function (value) {
      if (value.length === 0) {
        return ''
      } else if (value.length === 1) {
        return value.pop()
      } else {
        let tags = value[0] + ''
        for (let i = 1; i < value.length; i++) {
          tags = tags + ' / ' + value[i]
        }
        return tags
      }
    }
  },
  methods: {
    // 初始化列表
    async initList () {
      const listId = this.$route.params.id
      const date = new Date()
      const result = await reqMusicListDetail(listId, date.getTime()) // 获取歌单详情

      this.initListInfo(result.playlist)
      // 返回的歌单实体不完整，但ID是完整的，因此需要利用id请求歌曲获得歌曲详情
      const trackIds = result.playlist.trackIds
      const ids = []
      for (const item of trackIds) {
        ids.push(item.id)
      }
      this.$Spin.show()
      const musicLists = await reqMusicDetail(ids.toString(), date.getTime())
      this.$Spin.hide()
      if (musicLists.code !== 200) return this.$Message.error('遇到错误，我们会尽快处理！')
      this.musicList = musicLists.songs
    },
    initListInfo (playlist) {
      console.log('playList:', playlist)
      this.playListInfo.coverImgUrl = playlist.coverImgUrl
      this.playListInfo.name = playlist.name
      this.playListInfo.tags = playlist.tags
      this.playListInfo.trackCount = playlist.trackCount
      this.playListInfo.playCount = playlist.playCount
      this.playListInfo.description = playlist.description
      this.playListInfo.creator.nickname = playlist.creator.nickname
      this.playListInfo.creator.avatarUrl = playlist.creator.avatarUrl
    },
    // 播放全部
    playAll () {
      // 将列表内的音乐加入到state中
      this.$store.commit('setMusic', this.musicList)
      console.log(this.musicList)
    }
  }
}
</script>

<style lang='scss'>
.playlist-info {
  .playlist-top {
    padding: 20px;
    display: flex;
    align-items: space-between;
    // justify-content: center;
    .playlist-top-right {
      h2 {
        display: inline;
        font-size: 30px;
        font-weight: bold;
      }
      margin-left: 20px;
      .playlist-top-right-btn {
        // display: flex;
        // justify-content: space-around;
        margin-right: 20px;
        button {
          // margin-right: 20px;
          margin: 20px;
        }
      }
    }
  }
}
</style>

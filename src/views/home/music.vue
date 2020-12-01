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
    <Tabs :animated="false">
      <TabPane label="歌曲列表">
        <i-table :columns="columns" :data="musicList" ellipsis>
          <template slot-scope="{ row }" slot="singal">
            {{ row.ar[0].name }}
          </template>
          <template slot-scope="{ row }" slot="album">
            {{ row.al.name }}
          </template>
        </i-table></TabPane
      >
      <TabPane label="评论" style="padding: 20px"
        ><Input
          size="large"
          type="textarea"
          v-model="comment"
          placeholder="请输入评论。。。"
          :maxlength="140"
          show-word-limit
        /><Button shape="circle" style="text-aligin: right" @click="sendComment"
          >Circle</Button
        >
        <div class="comments">
          <h3>最新评论({{ total }})</h3>
          <div
            class="comment"
            v-for="item in commentList"
            :key="item.commentId"
          >
            <div class="user_img">
              <img :src="item.user.avatarUrl" />
            </div>
            <div class="user_text">
              <a href="http://www.baidu.com" target="_blank"
                >{{ item.user.nickname }}:</a
              >
              <span>{{ item.content }}</span>
              <!-- <p class="reply">哈哈哈</p> -->
              <p>
                <span><Time :time="item.time" type="datetime" /></span>
                <span style="float: right">
                  <span>
                    <a @click="listCommentLike(item)">
                      <Icon
                        :type="
                          item.liked ? 'ios-thumbs-up' : 'ios-thumbs-up-outline'
                        "
                      />({{ item.likedCount }}) </a
                    >| <a><Icon type="ios-text-outline" /></a> |
                    <a @click="delComment(item.commentId)"
                      ><Icon type="ios-share-alt-outline"
                    /></a>
                  </span>
                </span>
              </p>
            </div>
          </div>
          <Page
            :total="total"
            @on-change="pageChange"
            :current.sync="page"
            :styles="{ textAlign: 'center' }"
          />
        </div>
      </TabPane>
      <TabPane label="收藏者">
        <div class="collectors">
          <div
            class="collector"
            v-for="item in collectorList"
            :key="item.userId"
          >
            <div class="image">
              <img
                :src="item.avatarUrl"
                style="width: 80px; border-radius: 50%"
              />
            </div>
            <div class="text">
              <p>
                {{ item.nickname
                }}<Icon
                  :type="item.gender == 1 ? 'ios-male' : 'ios-female'"
                  :color="
                    item.gender == 1
                      ? 'rgb(38, 166, 228)'
                      : 'rgb(255, 181, 211)'
                  "
                  size="20"
                  style="font-weight: bold"
                />
              </p>
              <p>{{ item.signature }}</p>
            </div>
          </div>
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>

import { reqMusicListDetail, reqMusicDetail, reqGetListComment, reqCommentLike, reqSendComment, reqGetListSubscribers } from '../../api'
export default {

  created () {
    this.initList()
    this.initComments()
    this.initcollectors()
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
        id: 0,
        creator: {
          nickname: '',
          avatarUrl: '',
          userId: 0
        },
        tags: [],
        trackCount: 0,
        playCount: 0,
        description: ''
      },
      comment: '',
      commentList: [],
      total: 0,
      // 评论当前页码
      page: 1,
      collectorList: [],
      collectorTotal: 0,
      collectorPage: 1
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
    },
    formatTime: function (time) {
      const date = new Date(time)
      const year = date.getFullYear()
      const mon = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      return `${year}-${mon}-${day} ${hour}:${minute}`
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
      console.log(playlist)
      this.playListInfo.coverImgUrl = playlist.coverImgUrl
      this.playListInfo.name = playlist.name
      this.playListInfo.tags = playlist.tags
      this.playListInfo.id = playlist.id
      this.playListInfo.trackCount = playlist.trackCount
      this.playListInfo.playCount = playlist.playCount
      this.playListInfo.description = playlist.description
      this.playListInfo.creator.nickname = playlist.creator.nickname
      this.playListInfo.creator.avatarUrl = playlist.creator.avatarUrl
    },
    initComments () {
      this.getComment(0)
    },
    initcollectors () {
      this.getCollector(0)
    },
    async getComment (offset) {
      const date = new Date()
      const id = this.$route.params.id
      const result = await reqGetListComment({ id, offset }, date.getTime())
      console.log(result)
      this.commentList = result.comments
      this.total = result.total
    },
    // 获取收藏者
    async getCollector (offset) {
      const id = this.$route.params.id
      const result = await reqGetListSubscribers({ id, offset, limit: 300 })
      this.collectorTotal = result.total
      this.collectorList = result.subscribers

      console.log(result)
    },
    // 播放全部
    playAll () {
      // 将列表内的音乐加入到state中
      this.$store.commit('setMusic', this.musicList)
      console.log(this.musicList)
    },
    // 歌单评论喜欢
    async listCommentLike (item) {
      const { commentId: cid, liked } = item
      const id = this.playListInfo.id
      const t = liked ? 0 : 1
      const type = 2

      const result = await reqCommentLike({ id, cid, t, type })
      console.log(result)
    },
    // 发表评论
    async sendComment () {
      const date = new Date()
      const t = 1
      const type = 2
      const id = this.playListInfo.id
      const content = this.comment
      const result = await reqSendComment({ t, type, id, content }, date.getTime())
      if (result.code === 200) {
        this.$Message.success('发表成功！')
        this.comment = ''
        this.getComment((this.page - 1) * 20)
      }
    },
    async delComment (commentId) {
      const date = new Date()
      const t = 0
      const type = 2
      const id = this.playListInfo.id
      const result = await reqSendComment({ t, type, id, commentId }, date.getTime())
      console.log(result)
      if (result.code === 200) {
        this.$Message.success('删除成功！')

        this.getComment((this.page - 1) * 20)
      }
    },
    // 翻页
    pageChange (page) {
      console.log('翻页了！', page)
      this.getComment((page - 1) * 20)
    }
  },
  watch: {
    $route (to, from, next) {
      console.log(to, from, 1)
      if (to.name === 'musicList') {
        this.initList()
        this.initComments()
        this.initcollectors()
      }
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
.ivu-table-overflowY {
  &::-webkit-scrollbar {
    display: none;
  }
}
.ivu-list-item-action {
  text-align: right;
}
.comments {
  .comment {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    &:hover {
      background: rgb(244, 244, 244);
    }
    .user_text {
      width: 100%;
      .reply {
        background: rgb(244, 244, 244);
      }
    }
    .user_img {
      margin-right: 10px;
    }
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      overflow: hidden;
    }
  }
}
.collectors {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .collector {
    width: 30%;
    justify-content: center;
    display: flex;
    align-items: center;
    .image {
      width: 25%;
    }
    .text {
      width: 50%;
    }
  }
}
</style>

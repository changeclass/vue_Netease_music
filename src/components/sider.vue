<template>
  <Menu
    :theme="theme1"
    active-name="1"
    mode="vertical"
    width="200px"
    @on-open-change="getUserList"
  >
    <MenuGroup title="">
      <MenuItem name="1" :to="{ name: 'Discover' }">
        <Icon type="md-document" />
        发现音乐
      </MenuItem>
      <MenuItem name="2" :to="{ name: 'Artist' }">
        <Icon type="md-chatbubbles" />
        歌手
      </MenuItem>
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-paper" />
          创建的音乐
        </template>
        <MenuItem
          :to="{ name: 'musicList', params: { id: item.id } }"
          :name="item.id"
          v-for="item in userPlayList"
          :key="item.id"
          >{{ item.name }}</MenuItem
        >
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-paper" />
          收藏的音乐
        </template>
        <MenuItem name="1-1">文章管理</MenuItem>
        <MenuItem name="1-2">评论管理</MenuItem>
        <MenuItem name="1-3">举报管理</MenuItem>
      </Submenu>
    </MenuGroup>
  </Menu>
</template>

<script>
import { reqUserList } from '../api'

export default {
  props: ['theme1', 'width'],
  data () {
    return {
      userPlayList: []
    }
  },
  methods: {
    async getUserList () {
      const uid = this.$store.state.user.userId

      const result = await reqUserList(uid)
      this.userPlayList = result.playlist
    }
  },

  goList (id) {
    this.$route.push('/home/list/' + id)
  },
  created () {
    // this.getUserList()
  },
  computed: {

  }
}
</script>

<style lang='scss' scoped>
.ivu-layout-sider {
  ul {
    height: 100%;
    text-align: center;
    .ivu-menu-item-selected {
      color: var(--font_color) !important;
      background: rgb(246, 246, 247) !important;
      font-weight: bold;
      &::after {
        background: var(--theme_color) !important;
      }
    }
    .ivu-menu-item:hover {
      color: var(--theme_color) !important;
    }
  }
}
</style>

<template>
  <!-- 发现音乐 -->
  <div>
    <Menu mode="horizontal" :theme="theme1" active-name="1">
      <MenuItem name="1" :to="{ name: 'Personal' }">
        <!-- <Icon type="ios-paper" /> -->
        个性推荐
      </MenuItem>

      <MenuItem name="2" :to="{ name: 'SongSheet' }">
        <!-- <Icon type="ios-people" /> -->
        歌单
      </MenuItem>

      <MenuItem name="3" :to="{ name: 'radioStation' }">
        <!-- <Icon type="ios-construct" /> -->
        主播电台
      </MenuItem>

      <MenuItem name="4" :to="{ name: 'ranKingList' }">
        <!-- <Icon type="ios-construct" /> -->
        排行榜
      </MenuItem>

      <MenuItem name="5" :to="{ name: 'Singer' }">
        <!-- <Icon type="ios-construct" /> -->
        歌手
      </MenuItem>

      <MenuItem name="6" :to="{ name: 'newestMusic' }">
        <!-- <Icon type="ios-construct" /> -->
        最新音乐
      </MenuItem>
    </Menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      theme1: 'light'
    }
  }
}
</script>

<style lang='scss'>
.content {
  .ivu-menu-item-selected {
    color: black !important;
    font-weight: bold;
    border-bottom: 2px solid var(--theme_color) !important;
  }
  .ivu-menu-item:hover {
    color: black !important;
    border-bottom: 2px solid var(--theme_color) !important;
  }
}
</style>

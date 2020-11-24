<template>
  <Menu :theme="theme1" active-name="1" mode="vertical" width="200px">
    <MenuGroup title="">
      <MenuItem name="1" :to="{ name: 'Discover' }">
        <Icon type="md-document" />
        发现音乐
      </MenuItem>
      <MenuItem name="2" :to="{ name: 'Artist' }">
        <Icon type="md-chatbubbles" />
        歌手
      </MenuItem>
    </MenuGroup>
  </Menu>
</template>

<script>
export default {
  props: ['theme1', 'width'],
  data () {
    return {

    }
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

<template>
  <div>
    <Menu mode="horizontal" active-name="1">
      <MenuItem name="1" :to="{ name: 'VideoHome' }">
        <!-- <Icon type="ios-paper" /> -->
        视频
      </MenuItem>
    </Menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {

}
</script>

<style>
</style>

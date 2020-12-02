<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang='scss'>
#app {
  --theme_color: rgba(236, 65, 65, 1);
  --font_color: #333;
}
.ivu-scroll-wrapper {
  .ivu-scroll-container {
    overflow-x: hidden;
  }
}
</style>

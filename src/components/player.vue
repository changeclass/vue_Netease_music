<template>
  <div class="player">
    <img :src="imgUrl" alt="" />
    <div class="info">
      <p>ahhaha</p>
      <p>ahhaha</p>
    </div>
    <div class="progress">
      <Icon type="ios-trash-outline" :size="iconSize" />
      <Icon type="md-arrow-round-back" :size="iconSize" />
      <Icon type="md-arrow-dropright-circle" :size="iconSize" />
      <Icon type="md-arrow-round-forward" :size="iconSize" />
      <!-- <Icon type="md-finger-print" :size="iconSize" /> -->

      <Slider
        v-model="songTime"
        :ste="1"
        :marks="time"
        :tip-format="hideFormat"
      ></Slider>
    </div>
    <div>
      <span><Icon type="md-volume-up" :size="iconSize" /></span>
    </div>
    <div style="width: 100px; margin-right: 100px">
      <Slider v-model="voice" :ste="1" :tip-format="hideFormat"></Slider>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgUrl: 'https://cdn.jsdelivr.net/gh/sviptzk/HexoStaticFile@latest/avatar.jpg',
      iconSize: 30,
      // 歌曲时长
      songTime: 100,
      // 歌曲时间
      time: { 0: '0:00', 100: '3:00' },
      // 音量
      voice: 100
    }
  },
  methods: {
    // 因此滑块的提示
    hideFormat () {
      return null
    }
  }
}
</script>

<style lang='scss'>
.player {
  height: 100px;
  display: flex;
  align-items: center;
  img {
    width: 60px;
    border-radius: 2px;
    margin-right: 10px;
  }
  .progress {
    // justify-content: center;
    margin: 0 auto;
    text-align: center;
    width: 800px;
    .ivu-progress-bg {
      height: 5px !important;
    }
  }
}
</style>

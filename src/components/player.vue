<template>
  <div class="player">
    <!-- <div class="detail"></div> -->
    <audio
      :src="music.url"
      ref="audio"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeupdate"
      @loadedmetadata="onLoadedmetadata"
      @ended="ended"
      autoplay
    ></audio>
    <div class="left_party">
      <router-link :to="{ name: 'music', params: { audio: $refs.audio } }"
        ><img :src="musicObj.al ? musicObj.al.picUrl : ''" alt=""
      /></router-link>
      <!-- <img :src="musicObj.al ? musicObj.al.picUrl : ''" alt="" /> -->
      <div class="info">
        <p>{{ musicObj.name }}</p>
        <p>{{ musicObj.al ? musicObj.al.name : '' }}</p>
      </div>
    </div>
    <div class="center_party">
      <div class="progress">
        <Icon
          type="md-arrow-round-back"
          :size="music.iconSize"
          @click="prevMusic"
        />
        <Icon
          :type="music.play ? 'md-pause' : 'md-play'"
          :size="music.iconSize"
          @click="musicPlay"
        />
        <Icon
          type="md-arrow-round-forward"
          :size="music.iconSize"
          @click="nextMusic"
        />

        <Slider
          v-model="music.currentTime"
          :max="music.duration"
          :marks="music.time"
          :tip-format="formatSecond"
          @on-change="changeCurrentTime"
        ></Slider>
      </div>
    </div>
    <div class="right_party" style="margin-right: 100px">
      <div>
        <span><Icon type="md-volume-up" :size="music.iconSize" /></span>
      </div>
      <div style="width: 100px">
        <Slider
          v-model="music.voice"
          :step="0.1"
          :tip-format="music.hideFormat"
          :min="0"
          :max="1"
          @on-input="changeVoice"
        ></Slider>
      </div>
      <div>
        <Icon
          type="ios-list"
          style="margin-left: 50px"
          :size="music.iconSize"
          @click="onShowList"
        />
      </div>
    </div>
    <Drawer title="我的歌单" :closable="false" v-model="showList">
      <i-table
        :columns="columns"
        :data="musicList"
        ellipsis
        height="600"
        @on-row-dblclick="changeIndex"
      >
        <template slot-scope="{ row }" slot="singal">
          {{ row.ar[0].name }}
        </template>
        <template slot-scope="{ row }" slot="album">
          {{ row.al.name }}
        </template>
      </i-table>
    </Drawer>
  </div>
</template>

<script>

import { reqMusicUrl } from '../api'
// 将整数转换成 时：分：秒的格式
function realFormatSecond (second) {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
  } else {
    return '0:00:00'
  }
}
export default {
  data () {
    return {
      columns: [
        {
          title: 'Name',
          key: 'name'
        },
        {
          title: '歌手',
          key: 'singal',
          slot: 'singal'
        }],
      music: {
        name: '',
        url: '',
        iconSize: 30,
        // 歌曲时间
        time: {},
        // 音量
        voice: 1,
        // 是否播放
        play: false,
        // 音频总时间
        duration: 0,
        // 当前播放的长度
        currentTime: 0,
        // 是否暂停
        pause: false
      },
      // 当前音乐索引
      index: -1,
      // 显示播放列表
      showList: false
    }
  },
  created () {

  },
  computed: {
    musicObj () {
      if (this.$store.state.music.length !== 0) {
        return this.$store.state.music[this.index]
      } else {
        return {}
      }
    },
    musicList () {
      return this.$store.state.music
    }
  },
  watch: {
    async musicObj (newMusic, oldMusic) {
      if (newMusic === undefined) {
        this.index = 0
      }
    },
    index: async function (newIndex, oldIndex) {
      // 将索引保存在VUEX中
      this.$store.commit('setIndex', newIndex)
      // this.music.url = ''
      const date = new Date()
      const result = await reqMusicUrl(this.musicObj.id, date.getTime())
      // 将请求结果保存在vuex中
      this.$store.commit('setMusicObj', result)
      this.music.play = false
      const { url } = result.data[0]
      this.music.url = url
    }

  },
  filters: {
    // 将整数转化成时分秒

  },

  methods: {
    // 隐藏滑块的提示
    hideFormat () {
      return null
    },
    formatSecond (second = 0) {
      return realFormatSecond(second)
    },
    // 显示歌单列表
    onShowList () {
      this.showList = !this.showList
    },
    changeVoice (voice) {
      this.music.voice = voice
      this.$refs.audio.volume = this.music.voice
    },
    // 拖动播放进度条
    changeCurrentTime (index) {
      this.$refs.audio.currentTime = parseInt(index)
    },
    // 播放音乐
    musicPlay () {
      if (this.music.play === false) {
        this.$refs.audio.play()
      } else {
        this.$refs.audio.pause()
      }
    },
    nextMusic () {
      // console.log('nextMusic')
      this.index++
    },
    prevMusic () {
      this.index--
      console.log(this.index)
    },
    // 当音频播放
    onPlay () {
      this.music.play = true
    },
    // 当音频暂停
    onPause () {
      this.music.play = false
    },
    // 歌曲播放完成后
    ended () {
      this.index++
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate (res) {
      this.music.currentTime = res.target.currentTime
      this.$store.commit('setMusicTime', res.target.currentTime)
      this.music.time[0] = realFormatSecond(res.target.currentTime)
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      this.music.duration = parseInt(res.target.duration)
      const end = parseInt(res.target.duration)
      const time = {
        0: '0:00'
      }
      time[end] = realFormatSecond(parseInt(res.target.duration))
      this.music.time = time
    },
    // 歌单双击改变当前播放的音乐
    changeIndex (item, index) {
      this.index = index
      console.log(item)
    }
  }
}
</script>

<style lang='scss'>
.ivu-drawer-body {
  padding: 0 !important;
}
.player {
  height: 80px;
  display: flex;
  justify-content: space-between;
  .detail {
    width: 100%;
    height: 1000px;
    background: red;
  }
  img {
    width: 60px;
    border-radius: 2px;
    margin-right: 10px;
  }
  .left_party {
    align-items: center;
    display: flex;
    width: 154px;
    .info {
      display: inline-block;
      overflow: hidden; //超出部分隐藏
    }
    p {
      overflow: hidden; //超出部分隐藏
      text-overflow: ellipsis; //超出部分显示...
      white-space: nowrap; //文本强制一行显示
    }
  }
  .right_party {
    display: flex;
    align-items: center;
    .list {
      width: 250px;
      height: 300px;
      position: absolute;
      top: -280px;
      right: 0;
      border: 1px solid;
      overflow-y: auto;
      background: white;
    }
  }
  .progress {
    justify-content: center;
    margin: 0 auto;
    text-align: center;
    width: 800px;
    .ivu-progress-bg {
      height: 5px !important;
    }
  }
}
</style>

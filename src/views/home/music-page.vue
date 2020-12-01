<template>
  <!-- 歌曲播放详情页面 -->
  <div class="container">
    <div class="left">
      <img :src="music.al.picUrl" />
    </div>
    <div class="right">
      <h2>{{ music.al.name }}</h2>

      {{ currentTime }}
      <p>
        <span>专辑：{{ music.al.name }} </span>
        <span
          >歌手：
          <span v-for="(item, index) in music.ar" :key="index">
            {{ item.name }}
          </span>
        </span>
      </p>
      <div class="lyric">
        <div class="lyric-container" :style="{ marginTop: marginTop + 'px' }">
          <p
            v-for="(item, index) in lyrics"
            :key="index"
            :style="{ color: currentindex == index ? 'red' : 'black' }"
          >
            {{ item }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { reqGetLyric } from '../../api'
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
      lyric: [],
      // currentTime: 0
      // 保存匹配的时间
      times: [],
      // 保存匹配的歌词
      lyrics: [],
      marginTop: 0,
      currentindex: 0
    }
  },
  methods: {
    async getLyc () {
      this.marginTop = 0
      this.lyrics = []
      this.times = []
      const date = new Date()
      const id = this.music.id
      const result = await reqGetLyric(id, date.getTime())
      const array = result.lrc.lyric.split('\n')
      // console.log(this.lyric)
      // 正则表达式匹配内容
      const timeReg = /\[(\d*:\d*\.\d*)\]/
      array.forEach((ele, index) => {
        //   处理歌词
        var lrc = ele.split(']')[1]
        // console.log(lrc)
        //   排除空字符串(没有歌词)
        if (lrc === undefined || lrc.length === 1) return true
        this.lyrics.push(lrc)
        var res = timeReg.exec(ele)
        if (res == null) return true
        var timeStr = res[1]
        var res2 = timeStr.split(':')
        var min = parseInt(res2[0]) * 60
        var sec = parseFloat(res2[1])
        var time = parseFloat(Number(min + sec).toFixed(2))
        time = realFormatSecond(time)
        this.times.push(time)
      })

      // console.log(this.lyrics)
    },
    test () {
      // console.log(this.lyric, 1)
      // console.log(this.audio.currentTime)
    },
    currentIndex (time) {
      return this.times.indexOf(time)
    }

  },
  created () {
    this.getLyc()
  },
  computed: mapState({
    index: 'index',
    music: (state) => {
      const music = state.music[state.index]
      // this.getLyc()
      return music
    },
    audio: function () {
      // this.getLyc()
      return this.$route.params.audio
    },
    currentTime: function (state) {
      const time = realFormatSecond(state.musicTime)
      var index = this.currentIndex(time)
      if (index !== -1) {
        this.currentindex = index
        if (index <= 5) return
        this.marginTop = (-index + 2) * 80
      }
    }
  }),
  watch: {
    index (i) {
      console.log(i)
      this.getLyc()
    }
  }

}
</script>

<style lang='scss'>
.container {
  display: flex;
  width: 100%;
  height: 100%;
  .left {
    width: 50%;
    text-align: center;
    padding: 56px;
    overflow: hidden;
  }
  .right {
    width: 50%;
    // background: #fff;
    padding: 30px;
    text-align: center;
    p {
      line-height: 80px;
    }
    h2 {
      font-weight: bold;
      font-size: 30px;
    }
    .lyric {
      height: 400px;
      margin: 0 auto;
      text-align: center;
      width: 80%;
      border: 1px solid black;
      overflow: hidden;
      .lyric-container {
        margin-top: 1px;
        // overflow-y: scroll;
        width: 100%;
        height: 100%;
        transition: all 1s linear;
        .lyric-container::-webkit-scrollbar {
          display: none;
        }
      }
    }
  }
}
</style>

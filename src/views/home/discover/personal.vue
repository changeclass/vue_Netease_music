<template>
  <div class="personal">
    <Carousel v-model="BannerIndex" loop style="text-align: center">
      <CarouselItem v-for="(item, index) in bannerList" :key="index">
        <div class="demo-carousel"><img :src="item.imageUrl" /></div>
      </CarouselItem>
    </Carousel>
    <Card :bordered="false">
      <h2 slot="title">推荐歌单</h2>
      <Row :gutter="20">
        <i-col
          style="float: left; width: 20%; height: 240px; margin-bottom: 20px"
          v-for="(item, index) in personalized"
          :key="index"
        >
          <div
            style="
              border: 1px solid;
              height: 100%;
              overflow: hidden;
              text-align: center;
              display: flex;
              justify-content: center;
              cursor: pointer;
            "
            @click="toMusicList(item)"
          >
            <img :src="item.picUrl" />
          </div>
          <span>{{ item.name }}</span>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { reqPersonalized, reqLoginStatus, reqDailyMusic } from '../../../api'
import { mapGetters } from 'vuex'
export default {
  async created () {
    this.getDailyMusic()
    const result = await reqPersonalized()
    if (result.code === 200) {
      this.personalized = result.result
    }
  },
  methods: {
    async getDailyMusic () {
      const { code } = await reqLoginStatus()
      if (code === 200) {
        const result = await reqDailyMusic()
        if (result.code === 200) {
          this.personalized = result.recommend.splice(0, 10)
          // this.personalized = result.recommend
          console.log(result.recommend)
        } else {
          this.$Message.error('歌单获取失败')
        }
      } else {
        const result = await reqPersonalized()
        if (result.code === 200) {
          this.personalized = result.result
        } else {
          this.$Message.error('歌单获取失败')
        }
      }
    },
    toMusicList (item) {
      this.$router.push({ name: 'musicList', params: { id: item.id } })
    }
  },
  data () {
    return {
      BannerIndex: 0,
      bannerList: [],
      // 推荐歌单列表
      personalized: []
    }
  },
  computed: {
    ...mapGetters({ getUser: 'getUser' })
  }

}
</script>

<style lang='scss'>
.personal {
  .song {
    width: 200px;
    height: 200px;
    border: 1px solid black;
  }
}
</style>

<template>
  <div class="video-container">
    <div class="category">
      <Poptip placement="bottom-start" width="520">
        <Button shape="circle">全部视频</Button>
        <div slot="content" class="category-btn">
          <Row>
            <i-col span="4" v-for="tag in videoTags" :key="tag.id">
              <span @click="onClickTag(tag.id)">{{ tag.name }}</span>
            </i-col>
          </Row>
        </div>
      </Poptip>
    </div>
    <div class="videos">
      <Scroll :on-reach-bottom="handleReachBottom" height="450">
        <Row :gutter="16">
          <i-col span="6" v-for="item in videos" :key="item.data.vid">
            <div class="video">
              <img :src="item.data.coverUrl" />
              <h3>{{ item.data.title }}</h3>
              <span>by </span>
              <span class="author">{{ item.data.creator.nickname }}</span>
            </div>
          </i-col>
        </Row>
      </Scroll>
    </div>
  </div>
</template>

<script>
import { reqGetVideoTag, reqGetVideo } from '../../../api'
export default {
  data () {
    return {
      videoTags: [],
      currentTag: 0,
      videos: [],
      offset: 0
    }
  },
  methods: {
    // 获得所有标签
    async getVideoCategory () {
      const result = await reqGetVideoTag()
      this.videoTags = result.data
      this.currentTag = this.videoTags[0].id
    },
    // 点击标签
    onClickTag (id) {
      this.currentTag = id
    },
    // 滑动到底部
    async handleReachBottom () {
      console.log('加载中')
      const date = new Date()
      const result = await reqGetVideo(this.currentTag, this.offset, date.getTime())
      console.log(result)
      this.videos = [...this.videos, ...result.datas]
      this.offset += 8
    }
  },
  created () {
    this.getVideoCategory()
  },
  watch: {
    async currentTag (id) {
      const date = new Date()
      this.offset = 0
      const result = await reqGetVideo(id, this.offset, date.getTime())
      console.log(result)
      this.videos = result.datas
      this.offset += 8
    }
  }
}
</script>

<style scoped lang='scss'>
.video-container {
  padding: 20px;
  .category {
    .category-btn {
      height: 400px;
      overflow-y: auto;
    }
    .ivu-col {
      text-align: center;
      margin-bottom: 10px;
      cursor: pointer;
      &:hover {
        color: var(--theme_color);
      }
    }
  }
  .videos {
    // text-align: center;
    // margin-top: 20px;
    h3 {
      // font-size: 32px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
    }
    span {
      font-size: 10px;
      color: rgb(224, 224, 224);
    }
    .author {
      cursor: pointer;
      &:hover {
        color: black;
      }
    }
    .video {
      img {
        height: 172px;
        width: 305.77px;
      }
      margin-top: 20px;
      border: 1px solid black;
    }
  }
}
</style>

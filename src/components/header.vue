<template>
  <Header>
    <h1>
      <a href="/"><img :src="img_src" alt="" /></a>
    </h1>

    <Button
      shape="circle"
      icon="ios-arrow-back"
      type="error"
      @click="go(-1)"
    ></Button>
    <Button
      shape="circle"
      icon="ios-arrow-forward"
      type="error"
      @click="go(1)"
    ></Button>
    <div style="width: 190px">
      <Input search placeholder="Enter something..." />
    </div>
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1024px;
      "
      class="user"
      v-if="user.userId !== 0 && user.userId !== undefined"
    >
      <Poptip title="Title" content="content" @on-popper-show="showPopper">
        <Avatar :src="user.avatarUrl" />
        <span style="color: white">{{ user.nickname }}</span>
        <Icon type="ios-arrow-down" color="white" />
        <div slot="title" class="title">
          <div class="info">
            <p class="number">{{ user.eventCount }}</p>
            <p>动态</p>
          </div>
          <div class="info">
            <p class="number">{{ user.followeds }}</p>
            <p>关注</p>
          </div>
          <div class="info">
            <p class="number">{{ user.follows }}</p>
            <p>粉丝</p>
          </div>
          <div class="btn">
            <Button
              @click="userSingin"
              :disabled="user.userSign ? true : false"
              >{{ user.userSign ? '已签到' : '签到' }}</Button
            >
          </div>
        </div>

        <div slot="content" class="content">
          <List :split="false">
            <ListItem>
              <Icon type="md-star" />
              <span style="width: 100%">我的会员</span>
              <Icon type="ios-arrow-forward" class="right" />
            </ListItem>
            <ListItem>
              <Icon type="md-star" />
              <span style="width: 100%">等级</span>
              <Icon type="ios-arrow-forward" class="right"
            /></ListItem>
            <ListItem>
              <Icon type="md-star" />
              <span style="width: 100%">商城</span>
              <Icon type="ios-arrow-forward" class="right" />
            </ListItem>
            <ListItem>
              <Icon type="md-star" />
              <span style="width: 100%">个人信息设置</span>
              <Icon type="ios-arrow-forward" class="right" />
            </ListItem>
            <ListItem>
              <Icon type="md-star" />
              <span style="width: 100%">绑定社交账号</span>
              <Icon type="ios-arrow-forward" class="right" />
            </ListItem>
            <ListItem>
              <Icon type="md-power" />
              <span style="width: 100%" @click="userLogout">退出登录</span>
              <Icon type="ios-arrow-forward" class="right" />
            </ListItem>
          </List>
        </div>
      </Poptip>
    </div>
    <div
      v-else
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1024px;
      "
    >
      <span style="color: white" @click="userLoginModal">登录按钮</span>
    </div>
    <Modal
      title="用户登录"
      v-model="login"
      class-name="vertical-center-modal"
      :mask-closable="false"
      @on-ok="ok"
    >
      <Form ref="loginForm" :rules="userFormRule" :model="userLogin">
        <FormItem label="手机号码" prop="phone">
          <Input v-model="userLogin.phone" placeholder="Enter your phone" />
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input
            v-model="userLogin.password"
            placeholder="Enter your password"
            type="password"
          />
        </FormItem>
        <!--重点就是下面的代码了-->
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="login = false">取消</Button>
        <Button type="primary" size="large" @click="ok">确定</Button>
      </div>
    </Modal>
  </Header>
</template>

<script>
import logo from '../assets/image/logo.png'
import { reqLoginByPhone, reqLoginStatus, reqLogout, reqUserDetail, reqUserSignin } from '../api'

export default {
  data () {
    return {
      userLogin: {
        phone: '',
        password: ''
      },

      // 表单验证规则
      userFormRule: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      img_src: logo,
      login: false,
      user: {
        avatarUrl: '',
        birthday: '',
        djStatus: '',
        nickname: '',
        userId: 0,
        userType: '',
        followeds: 0,
        follows: 0,
        eventCount: 0,
        userSign: false
      }
    }
  },
  async created () {
    this.getUser()
  },
  methods: {
    // 初始化用户信息
    initUser (user) {
      if (user.userId) {
        this.user = user
      }
    },
    userLoginModal () {
      this.login = !this.login
    },
    async showPopper () {
      console.log(this.user.userId, 1)
      const result = await reqUserDetail(this.user.userId)
      const { mobileSign } = result
      const { followeds, follows, eventCount } = result.profile
      this.user = { ...this.user, followeds, follows, eventCount, userSign: mobileSign }
      // this.user.followeds = followeds
      // this.user.follows = follows
      // this.user.eventCount = eventCount
      // this.user.userSign = mobileSign
    },
    async userSingin () {
      console.log(this.user.pcSign, this.user.mobileSign)
      const mobileResult = await reqUserSignin()
      console.log(mobileResult)
    },
    async getUser () {
      const s = await reqLoginStatus()
      if (s.code === 200) {
        this.$store.commit('setUser', s.profile)
        this.initUser(this.$store.state.user)

        // this.getUserDetail(s.profile.userId)
      } else {
        console.log(1)
      }
    },
    async getUserDetail (userId) {
      const result = await reqUserDetail(userId)
      const { mobileSign } = result
      const { followeds, follows, eventCount } = result.profile

      this.user.followeds = followeds
      this.user.follows = follows
      this.user.eventCount = eventCount
      this.userSign = mobileSign
      console.log(result)
    },
    ok () {
      const { loginForm } = this.$refs
      loginForm.validate(async result => {
        if (result) {
          // 表单验证通过
          const result = await reqLoginByPhone(this.userLogin)

          if (result.code === 200) {
            this.getUser()
            this.login = false
          } else {
            this.$Message.error(result.msg)
          }
        } else {
          this.$Message.error('请完成验证信息')
        }
      })
    },
    // 退出登录
    async userLogout () {
      const result = await reqLogout()

      if (result.code === 200) {
        this.$Message.success('退出成功!')
        this.$store.commit('clearUser')
        this.user = {}
      }
    },
    go (value) {
      this.$router.go(value)
    }
  }
}
</script>

<style lang='scss' scoped>
$height: 72px;
.ivu-layout {
  height: 100%;
  header {
    display: flex;
    align-items: center;
    background: var(--theme_color);
    height: $height;
  }
  h1 {
    margin-left: 20px;
    height: $height;
    a {
      height: $height;
      float: left;
    }
  }
  .vertical-center-modal {
    display: flex;
    align-items: center;
    justify-content: center;

    .ivu-modal {
      top: 0;
    }
  }
  .user {
    .title {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      .info {
        width: 33.33%;
        text-align: center;
        .number {
          font-size: 21px;
          font-weight: bold;
          color: black;
        }
      }
    }
    .btn {
      width: 100%;
      text-align: center;
    }
    .content {
      .right {
        &::before {
          position: relative;
          right: 0;
        }
      }
    }
  }
}

.ivu-poptip-inner {
  .ivu-poptip-body {
    padding: 0 !important;
    .ivu-list-item {
      padding: 8px 0;
      &:hover {
        background-color: rgb(240, 241, 243);
        cursor: pointer;
      }
    }
    .content {
      margin-bottom: 0;
    }
  }
}
</style>

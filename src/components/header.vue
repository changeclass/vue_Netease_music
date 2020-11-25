<template>
  <Header>
    <h1>
      <a href="/"><img :src="img_src" alt="" /></a>
    </h1>

    <Button
      shape="circle"
      icon="ios-arrow-back"
      type="error"
      @click="
        () => {
          $route.go(-1)
        }
      "
    ></Button>
    <Button shape="circle" icon="ios-arrow-forward" type="error"></Button>
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
      v-if="user.userId !== 0 && user.userId !== undefined"
      @click="userLogout"
    >
      <Avatar :src="user.avatarUrl" />
      <span style="color: white">{{ user.nickname }}</span>
      <Icon type="ios-arrow-down" color="white" />
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
import { reqLoginByPhone, reqLoginStatus, reqLogout } from '../api'

export default {
  data () {
    return {
      userLogin: {
        phone: '18630257257',
        password: '5296306...'
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
        userType: ''
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
    async getUser () {
      const s = await reqLoginStatus()
      if (s.code === 200) {
        this.$store.commit('setUser', s.profile)
        this.initUser(this.$store.state.user)
      } else {
        console.log(1)
      }
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
}
</style>

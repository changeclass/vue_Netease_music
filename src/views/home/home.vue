<template>
  <Layout>
    <Header />
    <Layout>
      <Sider><Nav /></Sider>
      <Content class="content">
        <router-view />
      </Content>
    </Layout>
    <Footer><Player /></Footer>
  </Layout>
</template>

<script>
import Header from '../../components/header'
import Nav from '../../components/sider'
import Player from '../../components/player'
export default {
  components: { Header, Nav, Player }
}
</script>

<style lang='scss'>
.ivu-layout {
  // height: 100%;
  header {
    background: var(--theme_color);
    height: 72px;
  }
  .content {
    width: 100%;
    // height: 9999px;
    height: 100%;
    margin-bottom: 100px;
    overflow: hidden;
  }
}
footer {
  // height: 100px;
  width: 100%;
  position: fixed;
  bottom: 0;
  background: white;
  z-index: 999;
}
</style>

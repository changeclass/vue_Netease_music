/**
 * 包含应用中所有接口请求的函数的模块
 * 每个函数的返回值都是Promise
 */
import ajax from './ajax'

const BASE = 'http://localhost:3000'
const date = new Date()
// 登录
export const reqLoginByPhone = (userLogin) => ajax(BASE + '/login/cellphone?timestamp=' + date.getTime(), userLogin, 'POST')
// 获取登录状态
export const reqLoginStatus = () => ajax(BASE + '/login/status?timestamp=' + date.getTime())
// 退出登录
export const reqLogout = () => ajax(BASE + '/logout?timestamp=' + date.getTime())

// banner图
export const reqBanner = () => ajax(BASE + '/banner', 'post')

// 推荐歌单
export const reqPersonalized = () => ajax(BASE + '/personalized?limit=10', 'post')
// 每日推荐歌单
export const reqDailyMusic = () => ajax(BASE + '/recommend/resource', 'post')

// 获得歌单详情
export const reqMusicListDetail = (id) => ajax(BASE + '/playlist/detail', { id }, 'post')
// 获得歌曲详情
export const reqMusicDetail = (ids) => ajax(BASE + '/song/detail', { ids }, 'post')

// 我的云盘信息
export const reqCloud = () => ajax(BASE + '/user/cloud', 'post')

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
export const reqMusicListDetail = (id, time) => ajax(BASE + '/playlist/detail?timestamp=' + time, { id }, 'post')
// 获得歌曲详情
export const reqMusicDetail = (ids, time) => ajax(BASE + '/song/detail?timestamp=' + time, { ids }, 'post')
// 获得歌曲播放地址
export const reqMusicUrl = (id, time) => ajax(BASE + '/song/url?timestamp=' + time, { id }, 'post')
// 获得歌曲的歌词
export const reqGetLyric = (id) => ajax(BASE + '/lyric', { id }, 'post')
// 获得歌单的评论
export const reqGetListComment = (obj, time) => ajax(BASE + '/comment/playlist?timestamp=' + time, obj, 'post')
// 获得歌单的收藏者
export const reqGetListSubscribers = (obj, time) => ajax(BASE + '/playlist/subscribers?timestamp=' + time, obj, 'post')

// 获得歌单评论点赞
export const reqCommentLike = (obj) => ajax(BASE + '/comment/like', obj, 'post')
// 发表评论
export const reqSendComment = (obj, time) => ajax(BASE + '/comment?timestamp=' + time, obj, 'post')

// 我的云盘信息
export const reqCloud = () => ajax(BASE + '/user/cloud', 'post')
// 个人信息
export const reqUserDetail = (uid) => ajax(BASE + '/user/detail', { uid }, 'post')
// 签到
export const reqUserSignin = () => ajax(BASE + '/daily_signin')

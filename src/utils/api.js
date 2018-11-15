import wepy from 'wepy'

// 服务器接口地址
const host = 'http://larabbs-api.test/api'

// 普通请求
const request = async (options, showLoading = true) => {
    // 传入字符串转换为对象
  if (typeof options === 'string') {
    options = {
      url: options
    }
  }
  // 显示加载中
  if (showLoading) {
    wepy.showLoading({title: '加载中'})
  }
  // 拼接请求地址
  options.url = host + '/' + options.url
  // 调用小程序的 request 方法
  let response = await wepy.request(options)

  if (showLoading) {
    wepy.hideLoading()
  }

  // 服务器异常提示
  if (response.statusCode === 500) {
    wepy.showModal({
      title: '提示',
      content: '服务器错误，请稍后重试'
    })
  }
  return response
}

// 登录
const login = async (params = {}) => {
    // code 只能使用一次，所以每次单独调用
  let loginData = await wepy.login()

  params.code = loginData.code

    // 请求微信登录接口
  let authResponse = await request({
    url: 'weapp/authorizations',
    data: params,
    method: 'POST'
  })

  // 登录成功，记录token信息
  if (authResponse.statusCode === 201) {
    wepy.setStorageSync('access_token', authResponse.data.access_token)
    wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
  }
  return authResponse
}

export default{
  request,
  login
}

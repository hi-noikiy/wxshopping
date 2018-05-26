var app = getApp();
var token;
var userinfo;
var code;
var viewName;
Page({
  data: {
    loginView: true,
    hidden: true,
  },
  onShow: function () {
    var that = this
    token = wx.getStorageSync('token')
  },

  //获取用户信息及登陆
  getUserInfo: function (e) {
    var that = this
    userinfo = e.detail
    if (userinfo.errMsg == 'getUserInfo:fail auth deny') {
      that.setData({
        loginView: false,
      })
    } else {
      that.setData({
        hidden: false,
      })
      setTimeout(() => {
        wx.navigateBack({
          delta: 1
        })
      }, 4000)
      //调用登录接口
      wx.login({
        success: function (result) {
          code = result.code;
          that.doLogin();
        },
      })

    }
  },
  // 小程序用户登录
  doLogin: function () {
    var that = this
    if (code) {
      // 发起网络请求
      wx.request({
        url: app.apiUrl('user/login'),
        method: 'POST',
        data: {
          userinfo: userinfo,
          code: code
        },
        success: function (res) {
          wx.setStorage({
            key: 'token',
            data: JSON.parse(res.data.split('\n')[1]).token
          })
          wx.setStorage({
            key: 'openid',
            data: JSON.parse(res.data.split('\n')[1]).openid
          })
        }
      })
    } else {
      console.log('获取用户登录态失败！' + res.errMsg)
    }
  },
  //关闭授权弹框
  userInfoBtn: function () {
    var that = this
    that.setData({
      loginView: 'hide'
    })
  },
})
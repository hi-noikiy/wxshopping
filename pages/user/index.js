var app = getApp()
var token
var goodshistory
Page({
  data: {
    userInfo: {},
    is_first_action: true,
    userService: [
      {
        name: "我的砍价",
        icon: "daojianfu",
        link: "../bargain/order/index",
        color: "#FF0C4B"
      },
      {
        name: "我的拼团",
        icon: "shehuituanti",
        link: "../group/order/index",
        color: "#FFB80C"
      },
      {
        name: "我的代言",
        icon: "tableshare",
        link: "../user/speak",
        color: "#00B9FD"
      },
      {
        name: "增值发票",
        icon: "fapiaoguanli",
        link: "../invoice/create",
        color: "#FD4100"
      },
      {
        name: "收货地址",
        icon: "dizhi",
        link: "../address/index",
        color: "#7ACF00"
      },

    ],
  },
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
    wx.setStorageSync('flowcheckout', { from: "user" })
    goodshistory = wx.getStorageSync('goodshistory')
    var goodsNum = wx.getStorageSync('goodsNum')
    that.setData({
      goodsNum: goodsNum,
    })
    that.setData({
      is_first_action: true,
    })
    this.setData({
      recommend: '',
      orderNum: '',
    })
    that.user();
  },
  user: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user"),
      data: {
        per_page: "10",
        page: "1",
        list: goodshistory
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        that.setData({
          recommend: res.data.data.best_goods,
          orderNum: res.data.data.order,
          user: res.data.data,
          hidden: true
        })

      }
    })
  },
  invoiceNav: function (e) {
    var that = this
    token = wx.getStorageSync('token')
    if (that.data.is_first_action == true) {
      that.setData({
        is_first_action: false,
      })
      wx.request({
        url: app.apiUrl("user/invoice/detail"),
        method: "POST",
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        success: function (res) {
          if (res.data.data != false) {
            wx.navigateTo({ url: '../invoice/detail' })
          } else {
            wx.navigateTo({ url: '../invoice/create' })
          }
          that.setData({
            invoices: res.data.data
          })
        }
      })
    }
  },
  userAddress: function (e) {
    // wx.setStorageSync('userAddress', { from: "address" })
    wx.navigateTo({ url: '../address/index' })
  },
  //下拉刷新
  onPullDownRefresh: function () {
    var that = this
    wx.showNavigationBarLoading() //在标题栏中显示加载
    that.user();
    setTimeout(function () {
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  onShareAppMessage: function () {
    return {
      title: '小程序首页',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/user/user'
    }
  }


})
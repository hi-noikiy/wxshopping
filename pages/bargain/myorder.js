var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
var app = getApp()
var token
var openid;
var per_page = 30;
var page = 1;
Page({
  data: {
    current: "0",
    orders: [],
    orderJtou: '../../res/images/icon-arrowdown.png',
  },

  orderStatus: function (that, id) {
    wx.request({
      url: app.apiUrl('bargain/myBargain'),
      data: {
        per_page: per_page,
        page: page,
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        that.setData({
          list: res.data.data,
        })
      }
    })
  },
  onLoad: function (e) {
    var that = this
    token = wx.getStorageSync('token')
    this.orderStatus(this, that.data.current);
    //加载中
    this.loadingChange()
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})









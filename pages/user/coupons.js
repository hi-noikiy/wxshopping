//index.js
//获取应用实例
var app = getApp()
var token
var type = 0;
Page({
  data: {
    hiddenNo: false,
    hiddenHas: true,
    hiddenEnd: true,
  },
  onLoad: function () {
    var that = this
    var token = wx.getStorageSync('token')
    that.couponsList();
    //加载中
    this.loadingChange()
  },
  couponsList:function(){
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/conpont"),
      data: {
        type: type,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          couponsData: res.data.data
        });
      }
    })
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
  },
  //未使用
  noUse: function (e) {
    var that = this
    this.setData({
      hiddenNo: false,
      hiddenHas: true,
      hiddenEnd: true,
    })
    type = e.currentTarget.dataset.index
    that.couponsList();
  },
  //已使用
  hasUse: function (e) {
    var that = this
    this.setData({
      hiddenNo: true,
      hiddenHas: false,
      hiddenEnd: true,
    })
    type = e.currentTarget.dataset.index
    that.couponsList();
    that.loadingChange()
  },
  //已过期
  useEnd: function (e) {
    var that = this
    this.setData({
      hiddenNo: true,
      hiddenHas: true,
      hiddenEnd: false,
    })
    type = e.currentTarget.dataset.index
    that.couponsList();
    that.loadingChange()
  },
})
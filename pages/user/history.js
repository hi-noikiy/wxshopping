var app = getApp()
var token
var goodshistory
Page({
  data: {
  },
  onLoad: function () {
    var that = this
    goodshistory = wx.getStorageSync('goodshistory')
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("goods/history"),
      data: {
        size: "100",
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
          list:res.data.data
        })

      }
    })
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
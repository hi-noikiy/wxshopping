var app = getApp()
var token
Page({
  data: {
    storeList: []
  },
  collectstore: function (that) {
    var token = wx.getStorageSync('token')
    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.apiUrl("user/collectstore"),
      method: "post",
      data: {
        id: "1"
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          storeList: res.data
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    that.collectstore(that);
    that.loadingChange()
  },
  onChangeShowAttention: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var index = e.currentTarget.dataset.index;
    var store_id = that.data.storeList[index].store_id;
    wx.request({
      url: app.apiUrl("store/attention"),
      data: {
        id: store_id,
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        var result = res.data;
        if (result == 0) {
          wx.showToast({
            title: '关注已取消',
            icon: 'warn',
            duration: 200
          })
        }
        that.collectstore(that);
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

  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },


})
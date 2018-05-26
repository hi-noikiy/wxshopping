//index.js
//获取应用实例
var app = getApp()
var token
var size = 30;
var page = 1;
var team_id
Page({
  data: {
    hiddenNo: false,
    hiddenHas: true,
    hiddenEnd: true,
  },
  onLoad: function (options) {
    var that = this
    team_id = options.objectId;
    var token = wx.getStorageSync('token')
    that.userList();
    //加载中
    this.loadingChange()
  },
  userList: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("team/teamUser"),
      data: {
        size: size,
        page: page,
        team_id: team_id   
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          listsData: res.data.data
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
})
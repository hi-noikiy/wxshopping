var app = getApp()
var order = {
  id: "",
}
var userId
Page({
  data: {
    hidden: false,
    code_img: ""
  },
  /**
   * 页面的初始数据
   */
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
  },
  onLoad: function (options) {
    var that = this
    // 获取用户数据
    var goodsId = options.objectId;
    order.id = goodsId;
    userId = options.userId;
    // 生命周期函数--监听页面加载
    var token = wx.getStorageSync('token')
    // 获取用户数据
    var goodsId = options.objectId;
    order.id = goodsId
    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.apiUrl("goods/share"),
      data: {
        user_id: userId,
        id: goodsId,
        path: 'pages/goods/index?objectId=' + order.id//当前分享二维码页
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        userId = res.data.data.user.id
        wx.setNavigationBarTitle({
          title: '[分享]' + res.data.data.goods_cont.name,
        })
        if (res.data.data != undefined) {
          that.setData({
            goods: res.data.data,
            hidden: true,
          })
        }
      }
    })
  },
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
  },
  onShareAppMessage: function () {
    var that = this
    var user_name = that.data.goods.user.name
    var goods_name = that.data.goods.goods_cont.name
    return {
      title: [user_name] + '给您分享' + goods_name,
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/goods/speak?objectId=' + order.id + "&userId=" + userId
    }
  },
})
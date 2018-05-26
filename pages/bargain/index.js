var app = getApp();
var token
var url = app.apiUrl("bargain/list")
var page = 1;
var per_page = 10;
var storeList = function (that) {
  var token = wx.getStorageSync('token')
  var user_id = wx.getStorageSync('user_id')
  wx.request({
    url: url,
    data: {
      page: page,
      per_page: per_page,

    },
    header: {
      'Content-Type': 'application/json',
      'X-ECTouch-Authorization': token
    },
    method: "POST",
    success: function (res) {
      if (res.data.data != undefined) {
        that.setData({
          index: res.data.data,
          hidden: true
        });
      }
    }
  })
}
Page({
  data: {
    index: [],
    iphoneView: true,
    hidden: false,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    hasLocation: false,
  },
  onShow:function(){
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: (res.windowHeight - 50)
        });
      }
    });
    //初始化onLoad
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("bargain"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          banner: res.data.data.banner,
        })
      }
    })
    page = 1;
    storeList(that);
  },



  //获取点击的id值
  siteDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.index[index].id;
    wx.navigateTo({
      url: "../bargain/goods?objectId=" + goodsId
    });
  },
  //快捷导航
  commonNav: function () {
    var that = this;
    var nav_select
    that.setData({
      nav_select: !that.data.nav_select
    });
  },
  nav: function (e) {
    var that = this;
    var cont = e.currentTarget.dataset.index;
    if (cont == "home") {
      wx.switchTab({
        url: '../index/index',
      });
    } else if (cont == "fenlei") {
      wx.switchTab({
        url: '../category/index',
      });
    } else if (cont == "cart") {
      wx.switchTab({
        url: '../flow/index',
      });
    } else if (cont == "profile") {
      wx.switchTab({
        url: '../user/index',
      });
    }
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '砍价商城',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/bargain/index'
    }
  }
})
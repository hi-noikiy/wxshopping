//index.js
//获取应用实例
var app = getApp()
var token
Page({
  data: {
    hidden: false,
  },
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    that.storeList();
  },
  storeList: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("store"),
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data != undefined) {
          that.setData({
            list: res.data,
            hidden: true,
          });
        }
      }
    })
  },
  onChangeShowAttention: function () {
    var that = this
    var token = wx.getStorageSync('token')
    var user_id = wx.getStorageSync('user_id')
    wx.request({
      url: app.apiUrl("store/attention"),
      data: {
        id: user_id,
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        that.setData({
          collect: res.data.collect,
          store_num: res.data.collnum
        })
      }
    })
  },
  siteDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.index.goods_list[index].goods_id;
    wx.navigateTo({
      url: "../goods/index?objectId=" + goodsId
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
})
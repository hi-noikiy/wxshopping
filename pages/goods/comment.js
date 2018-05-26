//index.js
//获取应用实例
var app = getApp()
var goodsId = 0
Page({
  data:{  
  },
  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    goodsId = options.objectId;
    wx.request({
      url: app.apiUrl("goods/detail"),
      data: {
        "id": goodsId,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          goodsComment: res.data.data.goods_comment
        })
      }
    })
    //加载中
    this.loadingChange()
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
    loadingChange() {
      setTimeout(() => {
        this.setData({
          hidden: true
        })
      }, 1000)
    },
})









var app = getApp();
var token
var url = app.apiUrl("bargain/list")
var page = 1;
var per_page = 100;
var storeList = function (that) {
  var token = wx.getStorageSync('token')
  var user_id = wx.getStorageSync('user_id')
  if (that.data.isListData == true) {
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
        var lists = that.data.index
        for (var i = 0; i < res.data.data.length; i++) {
          lists.push(res.data.data[i]);
        }
        that.setData({
          index: lists,
          isListData: (res.data.data == '' ? false : true),
        });
        page++;
      }
    })
  }
}
Page({
  data: {
    index: [],
    iphoneView: true,
    hidden: true,
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    hasLocation: false,
    isListData: true, //用于判断orderListData数组是不是空数组，默认true，空的数组
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
    // that.onChangeShowIphone();
    //加载中
    this.loadingChange();
  },

  scroll: function (e) {
    if (e.detail.scrollTop > 500) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
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
  // onChangeShowIphone: function () {
  //   var that = this;
  //   that.setData({
  //     iphoneView: (!that.data.iphoneView)
  //   })
  // },
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
  bindDownLoad: function () {
    var that = this;
    storeList(that);
    this.setData({
      bottomloading: 'active',
    });
    setTimeout(() => {
      this.setData({
        bottomloading: '',
      });
    }, 500)
  },
  //滚动触发事件
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
    });
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '砍价列表',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/bargain/list'
    }
  }
})
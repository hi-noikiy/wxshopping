var app = getApp();
var token
var page = "1"
var size = '40'
var tc_id = '0'
Page({
  data: {
    hidden: false,
    indicatorDots: true,
    autoplay: true,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    scrollTop: 0,
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
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("team/virtualOrder"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          index_user: res.data.data
        })
      }
    })
    that.homeCont();//拼团首页广告
    that.groupList();//商品列表
  },

  //拼团首页
  homeCont: function () {
    var that = this
    //初始化onLoad
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("team"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data.data != undefined) {
          that.setData({
            index: res.data.data,
            hidden: true
          })
        }
      }
    })
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var cur = e.target.dataset.current;
    var index = e.currentTarget.dataset.index
    if (index != 'home') {
      if (cur > 3) {
        that.setData({
          scrollLeft: 300
        })
      } else {
        that.setData({
          scrollLeft: 0
        })
      }
      //子频道API
      tc_id = cur
      that.groupList();
      wx.request({
        url: app.apiUrl("team/categoriesIndex"),
        method: "POST",
        data: {
          tc_id: cur
        },
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        success: function (res) {
          wx.setNavigationBarTitle({
            title: res.data.data.title,
          })
          that.setData({
            index: res.data.data,
          })

        }
      })
    } else {
      //拼购首页
      tc_id = 0
      that.groupList();
      that.homeCont();
      wx.setNavigationBarTitle({
        title: '拼购',
      })
    }
    //切换效果
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
    this.setData({
      scrollTop: 0
    })
  },
  /*返回顶部*/
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    // this.setData({
    //   scrollTop: e.detail.scrollTop
    // });
    if (e.detail.scrollTop > 300) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
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
  //子频道
  groupChannel: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var tcId = that.data.index.team_categories_child[index].tc_id
    wx.navigateTo({
      url: "../group/channel?objectId=" + tcId
    });

  },
  //商品列表
  groupList: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("team/teamList"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      data: {
        page: page,
        size: size,
        tc_id: tc_id
      },
      success: function (res) {
        that.setData({
          list: res.data.data,
        })
      }

    })
  },
  //获取点击的id值
  siteDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.list[index].goods_id;
    wx.navigateTo({
      url: "../group/goods?objectId=" + goodsId
    });
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: '小程序拼购',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/group/index'
    }
  }
})
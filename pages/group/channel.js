var app = getApp()
var url = app.apiUrl("team/categoryList ");
var tc_id
var page = '1'
var size = '30'
var keyword = '1'
var sort_key = '0'
var sort_value = 'ASC'
// 获取数据的方法，具体怎么获取列表数据大家自行发挥

var GetList = function (that) {
  that.setData({
    hidden: false
  });
  if (sort_value == 'ASC') {
    sort_value = 'DESC'
  } else {
    sort_value = 'ASC'
  }

  var token = wx.getStorageSync('token');
  wx.request({
    url: url,
    data: {
      tc_id: tc_id,
      page: page,
      size: size,
      keyword: keyword,
      sort_key: sort_key,
      sort_value: sort_value  
    },
    method: "post",
    header: {
      'Content-Type': 'application/json',
      'X-ECTouch-Authorization': token
    },
    success: function (res) {
      that.setData({
        list: res.data.data,
        hidden: true
      });
    }
  });
}
Page({
  data: {
    loadingSize: '20',
    loadingColor: "#444444",
    current: "0",
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0,
    maskVisual: 'hidden',
    currentItem: 0,
    currentPrice: 0,
    showView: true,
    showPrice: true,
    brandsCate: [
      {
        data_id: "0",
        id: "0",
        name: "全部",
        checked: true
      },
      {
        data_id: "1",
        id: "1",
        name: "苹果"
      },
      {
        data_id: "2",
        id: "2",
        name: "三星"
      }
    ],
    hotrecent: [
      {
        id: "0",
        name: "0-500",
        checked: true
      },
      {
        id: "1",
        name: "501-1000"
      },
      {
        id: "2",
        name: "1001-10000"
      }
    ]
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
  onLoad: function (options) {
    page = 1;
    tc_id = options.objectId;
    //   这里要非常注意，微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    //加载中
    this.loadingChange()
    GetList(that);
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },
  /*header*/
  bindHeaderTap: function (event) {
    var that = this
    that.setData({
      current: event.target.dataset.index,
    });
    page = 1;
    sort_key = event.target.dataset.index
    GetList(this)
  },

  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  onShow: function () {
    //   在页面展示之后先获取一次数据

  },
  bindDownLoad: function () {
    //   该方法绑定了页面滑动到底部的事件
    var that = this;
    GetList(that);
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
    });
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrollTop: 0
    })
  },
  topLoad: function (event) {
    //   该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    page = 1;
    this.setData({
      // list: [],
      scrollTop: 0
    });
    GetList(this)
  },

  /*筛选*/
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  onChangeShowPrice: function () {
    var that = this;
    that.setData({
      showPrice: (!that.data.showPrice)
    })
  },

  cascadePopup: function () {

    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: 'ease-in-out'
    });
    this.animation = animation;
    animation.translateX(-1000).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'show'
    })
  },
  //点击遮区域关闭弹窗
  cascadeDismiss: function () {
    this.animation.translateX(1000).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden'
    });
  },
  /*品牌列表 */
  tagChoose: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      'currentItem': id
    })
  },

  tagPrice: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      'currentPrice': id
    })
  },

  radioChange: function (e) {
    var that = this
    that.setData({
      name: e.detail.value
    })
  },

  priceChange: function (e) {
    var that = this
    that.setData({
      pricenName: e.detail.value
    })
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
  onShareAppMessage: function () {
    return {
      title: '商品列表',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/product_list/product_list'
    }
  }

})
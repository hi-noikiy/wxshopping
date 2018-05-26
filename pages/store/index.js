//index.js
//获取应用实例
var app = getApp()
var token
var url = app.apiUrl("store/detail")
var page = 1;
var per_page = 100;
var cate_key = "is_on_sale";
var sort = "sort_order";
var order = "ASC";
var cat_id = "0";
var user_id;
var storeList = function (that) {
  token = wx.getStorageSync('token')
  user_id = wx.getStorageSync('user_id')
  if (that.data.isListData == true) {
    wx.request({
      url: url,
      data: {
        id: user_id,
        page: page,
        per_page: per_page,
        cate_key: cate_key,
        sort: sort,
        order: order,
        cat_id: cat_id
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        if (res.data != undefined) {
          res.data.category.unshift({ cat_name: "全部商品", cat_id: 0 });
          var lists = that.data.store_goods
          for (var i = 0; i < res.data.goods.length; i++) {
            lists.push(res.data.goods[i]);
          }
          that.setData({
            store_goods: lists,
            isListData: (res.data.goods == '' ? false : true),
          });
          page++;
          that.setData({
            store_data: res.data,
            store_num: res.data.collnum,
            store_cont: res.data.detail.sellershopinfo,
            brandsCate: res.data.category,
            collect: (res.data.collect.ect == 1) ? 'true' : false,
            hidden: true,
          })
        }
      }
    })
  }
}
Page({
  data: {
    loadingSize: '20',
    loadingColor: "#444444",
    store_goods: [],
    showAttention: true,
    showPrice: true,
    showTop: false,
    showBot: true,
    hiddenAll: false,
    hiddenNew: true,
    hiddenSale: true,
    hiddenCateAll: true,
    hiddenSynthesize: false,
    hiddenNum: true,
    hiddenPrice: true,
    cateName: "分类",
    hidden: false,
    currentItem: 0,
    scrollHeight: 0,
    isListData: true, //用于判断orderListData数组是不是空数组，默认true，空的数组
  },

  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: (res.windowHeight - 50)
        });
      }
    });
    var user_id = options.objectId
    wx.setStorageSync('user_id', user_id)
    //初始化
    page = 1;
    storeList(that);

  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
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
  /**内容切换 */
  toAll: function (e) {
    var that = this
    this.setData({
      hiddenAll: false,
      hiddenNew: true,
      hiddenSale: true,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })

    cate_key = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()
  },
  toNew: function (e) {
    var that = this
    that.setData({
      hiddenAll: true,
      hiddenNew: false,
      hiddenSale: true,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    cate_key = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()

  },
  toSale: function (e) {
    var that = this
    that.setData({
      hiddenAll: true,
      hiddenNew: true,
      hiddenSale: false,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    cate_key = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()
  },

  //全部分类
  toCateAll: function (e) {
    var that = this
    page = 1;
    this.setData({
      hiddenCateAll: false,
      hiddenSynthesize: true,
      hiddenNum: true,
      hiddenPrice: true,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    sort = e.currentTarget.dataset.index
    storeList(that);
    that.loadingChange()
  },
  toSynthesize: function (e) {
    var that = this
    this.setData({
      hiddenCateAll: true,
      hiddenSynthesize: false,
      hiddenNum: true,
      hiddenPrice: true,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    sort = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()
  },
  toNum: function (e) {
    var that = this
    this.setData({
      hiddenCateAll: true,
      hiddenSynthesize: true,
      hiddenNum: false,
      hiddenPrice: true,
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    sort = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()
  },
  toPrice: function (e) {
    var that = this
    if (order == "DESC") {
      order = "ASC"
    } else {
      order = "DESC"
    }
    that.setData({
      hiddenCateAll: true,
      hiddenSynthesize: true,
      hiddenNum: true,
      hiddenPrice: false,
      showPrice: (!that.data.showPrice),
      showTop: (!that.data.showTop),
      showBot: (!that.data.showBot),
      store_goods: [],
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    sort = e.currentTarget.dataset.index
    page = 1;
    storeList(that);
    that.loadingChange()
  },
  //获取点击的id值
  siteDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.store_goods[index].goods_id;
    wx.navigateTo({
      url: "../goods/index?objectId=" + goodsId
    });
  },
  storeDetail: function () {
    var id = this.data.store_data.detail.user_id
    wx.redirectTo({
      url: "../store/detail?objectId=" + id
    });
  },
  //分类弹框
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
  cascadeDismiss: function (e) {
    var id = e.currentTarget.dataset.id;
    this.animation.translateX(1000).step();
    this.setData({
      animationData: this.animation.export(),
      maskVisual: 'hidden',
      currentItem: id
    });
    cat_id = id
  },
  radioChange: function (e) {
    var that = this

    if (e.detail.value == "全部商品") {
      that.setData({
        cateName: "分类",
        store_goods: [],
        isListData: true,  //第一次加载，设置true
        scrollTop: 0,
        viewBox: false
      })
    } else {
      that.setData({
        cateName: e.detail.value,
        store_goods: [],
        isListData: true,  //第一次加载，设置true
        scrollTop: 0,
        viewBox: false
      })
    }
    page = 1;
    storeList(that);
    that.loadingChange()
  },
  bindDownLoad: function () {
    var that = this;
    this.setData({
      bottomloading: 'active',
    });
    setTimeout(() => {
      this.setData({
        bottomloading: '',
      });
    }, 500)
    storeList(that);
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
  //滚动触发事件
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
    });
  },
})
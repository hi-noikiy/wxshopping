var app = getApp()
var url = app.apiUrl("goods/list");
var page = 1;
var per_page = 100;
var sort_key = "0";
var sort_value = "0";
var id = 1;
var shop = 1;
var keyword = '';
var proprietary = '';
var price_min;
var price_max;
var brand = '';
var fil_key = '';
var province_id;
var city_id;
var county_id;
var name;
var GetList = function (that) {
  var token = wx.getStorageSync('token');
  if (that.data.isListData == true) {
    wx.request({
      url: url,
      data: {
        page: page,
        per_page: per_page,
        keyword: keyword,
        shop: shop,
        id: id,
        sort_key: sort_key,
        sort_value: sort_value,
        warehouse_id: "1",
        area_id: "1",
        proprietary: proprietary,
        price_min: price_min,
        price_max: price_max,
        brand: brand,
        fil_key: fil_key,
        province_id: province_id,
        city_id: city_id,
        county_id: county_id,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data.data == '') {
          that.setData({
            list: res.data.data,
          });
        }
        if (res.data.data != undefined) {
          var lists = that.data.list
          for (var i = 0; i < res.data.data.length; i++) {
            lists.push(res.data.data[i]);
          }
          that.setData({
            list: lists,
            isListData: (res.data.data == '' ? false : true),
            hidden: true
          });
          page++;
        }
      }
    });
  }
}
Page({
  /**
 * 数据控制
 * showView:商品列表切换图标，
 * arrange 商品列表,默认为true(横向列表),
 * isListData 用于判断orderListData数组是不是空数组，默认true，空的数组
 * hiddenCateAll 综合
 * hiddenNum 销量
 * hiddenPrice 价格
 * hiddenSynthesize 筛选
 * showTop 价格排序（从高到底）
 * showTop 价格排序（从底到高）
 */
  data: {
    hidden: false,
    current: "0",
    list: [],
    scrollTop: 0,
    showView: true,
    arrange: 'arrange',
    isListData: true,
    hiddenCateAll: false,
    hiddenNum: true,
    hiddenPrice: true,
    hiddenSynthesize: true,
    showTop: false,
    showBot: true,
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
    var that = this;
    proprietary = options.objectId;
    price_min = options.price_min;
    price_max = options.price_max;
    brand = options.brand;
    province_id = options.province_id;
    city_id = options.city_id;
    county_id = options.county_id;
    fil_key = options.fil_key;
    id = (options.id ? options.id:'');
    name = (options.name && options.content ? options.content : options.name ? options.name : options.content ? options.content : '搜索商品')
    keyword = (options.content ? options.content:'')//接收搜索关键词
    that.setData({
      cateName: name,
      keyword: keyword
    });
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 90
        });
      }
    });
    page = 1;
    GetList(that);
  },
  //筛选
  toSynthesize: function (event) {
    var that = this
    wx.redirectTo({
      url: "../category/screen?objectId=" + id,
    });
  },

  //综合
  toCateAll: function (event) {
    var that = this
    if (event.currentTarget.id == 'list-0') {
      page = 1;
      that.setData({
        hiddenCateAll: false,
        hiddenSynthesize: true,
        hiddenNum: true,
        hiddenPrice: true,
        list: [],
        current: event.currentTarget.dataset.index,
        isListData: true,  //第一次加载，设置true
        scrollTop: 0,
        viewBox: false
      });
      sort_key = event.currentTarget.dataset.index
      GetList(that)
    }
  },
  //销量
  toNum: function (event) {
    var that = this
    if (event.currentTarget.id == 'list-0') {
      page = 1;
      that.setData({
        hiddenCateAll: true,
        hiddenSynthesize: true,
        hiddenNum: false,
        hiddenPrice: true,
        list: [],
        current: event.currentTarget.dataset.index,
        isListData: true,  //第一次加载，设置true
        scrollTop: 0,
        viewBox: false
      });
      sort_key = event.currentTarget.dataset.index
      GetList(that)
    }
  },
  //价格
  toPrice: function (event) {
    var that = this
    if (sort_value == 1) {
      sort_value = 0
    } else {
      sort_value = 1
    }
    that.setData({
      hiddenCateAll: true,
      hiddenSynthesize: true,
      hiddenNum: true,
      hiddenPrice: false,
      showPrice: (!that.data.showPrice),
      showTop: (!that.data.showTop),
      showBot: (!that.data.showBot),
      list: [],
      current: event.currentTarget.dataset.index,
      isListData: true,  //第一次加载，设置true
      scrollTop: 0,
      viewBox: false
    })
    sort_key = event.currentTarget.dataset.index
    page = 1;
    GetList(that)
  },

  //该方法绑定了页面滑动到底部的事件
  bindDownLoad: function () {
    var that = this;
    this.setData({
      bottomloading: 'active',
    });
    var token = wx.getStorageSync('token');
    if (that.data.isListData == true) {
      wx.request({
        url: url,
        data: {
          page: page,
          per_page: per_page,
          keyword: keyword,
          shop: shop,
          id: id,
          sort_key: sort_key,
          sort_value: sort_value,
          warehouse_id: "1",
          area_id: "1"
        },
        method: "post",
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        success: function (res) {
          var lists = that.data.list
          for (var i = 0; i < res.data.data.length; i++) {
            lists.push(res.data.data[i]);
          }
          that.setData({
            list: lists,
            isListData: (res.data.data == '' ? false : true),
            bottomloading: '',
          });
          page++;
        }
      });
    } else {
      that.setData({
        bottomloading: '',
      })
    }
  },
  //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop,
      viewBox: true
    });
  },
  //回到顶部
  goToTop: function () {
    this.setData({
      scrollTop: 0
    })
  },
  /*商品排列切换*/
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView),
      arrange: (that.data.arrange ? '' : 'arrange')
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
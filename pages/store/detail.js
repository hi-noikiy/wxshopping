//index.js
//获取应用实例
var app = getApp()
var token
var url = app.apiUrl("store/detail")
var page = 1;
var per_page = 40;
var cate_key = "is_on_sale";
var sort = "sort_order";
var order = "ASC";
var cat_id = "0";
var storeList = function (that) {
  var token = wx.getStorageSync('token')
  var user_id = wx.getStorageSync('user_id')
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
      that.setData({
        store_data: res.data,
        store_num: res.data.collnum,
        store_cont: res.data.detail.sellershopinfo,
      })
    }
  })
}
Page({
  data: {
    store_goods: [],
  },

  onLoad: function (options) {
    var that = this;
    var user_id = options.objectId
    wx.setStorageSync('user_id', user_id)
    //初始化
    storeList(that);
    that.loadingChange()
  },
  onUnload: function () {
    var that = this
    var user_id = wx.getStorageSync('user_id')
    wx.navigateTo({
      url: "../store/index?objectId=" + user_id
    });
  },
  loadingChange() {
    this.setData({
      hidden: false
    })
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
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
  openLocation: function (e) {
    console.log(e)
    var value = e.detail.value
    console.log(value)
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude),
      name: value.name,
      address: value.address
    })
  }
})
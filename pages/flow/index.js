var app = getApp()
var token
Page({
  data: {
    items: [],
    startX: 0, //开始坐标
    startY: 0,
    toView: 'blue',
    zujiIcon: '../../res/images/icon-zuji.png',
    zijiName: '推荐商品',
    selectedMenuId: 1,
    is_first_action: true,
    total: {
      count: 0,
      money: 0
    },
  },

  getCartGoods: function (that) {
    var token = wx.getStorageSync('token')
    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.apiUrl("cart"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var attr;
        var temp = '';
        for (var i in res.data.cart_list) {
          attr = res.data.data.cart_list[i].goods_attr.split('\n')
          temp = ''
          for (var j in attr) {
            if (attr[j] == '') continue;
            temp += attr[j] + ','
          }
          res.data.cart_list[i].goods_attr = temp.substring(0, temp.length - 1)
        }
        if (res.data.data.cart_list == '' || res.data.data.cart_list == undefined) {
          that.setData({
            shopLists: '',
            indexGoods: res.data.data.best_goods,
            cartData: res.data.data
          })
        } else {
          that.setData({
            shopLists: res.data.data.cart_list,
            total: res.data.data.total,
            indexGoods: res.data.data.best_goods,
            cartData: res.data.data
          })
        }
      }


    })
  },
  onLoad: function () {
    token = wx.getStorageSync('token')
    var that = this
    this.getCartGoods(that);

    //加载中
    this.loadingChange()
  },
  onShow: function () {
    var that = this
    this.getCartGoods(that);
    this.loadingChange();
    that.setData({
      is_first_action: true,
    })
  },
  loadingChange() {
    // this.setData({
    //   hidden: false
    // })
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
  },

  addCount: function (event) {
    var that = this
    let data = event.currentTarget.dataset
    let total = that.data.total
    let shopLists = that.data.shopLists

    var arr = [];
    var shopList, v;
    for (var i in shopLists) {
      arr.push(shopLists[i]);
    }
    for (v in arr) {
      shopList = arr[v].find(function (u) {
        return u.rec_id == data.id
      })
      if (shopList != undefined) {
        break;
      }
    }
    shopList.goods_number = parseInt(shopList.goods_number) + 1
    total.count += 1
    shopLists.total_price += parseInt(shopList.goods_price)

    //改变购物车商品数量
    wx.request({
      url: app.apiUrl('cart/update'),
      data: {
        id: data.id,
        amount: shopList.goods_number
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: 'POST',
      success: function (res) {
        if (res.data.msg == '库存不足') {
          wx.showToast({
            title: '库存不足',
            image: '../../images/failure.png',
            duration: 2000
          })
        } else {
          that.onLoad()
        }
      }
    })
  },
  minusCount: function (event) {
    var that = this
    let data = event.currentTarget.dataset
    let total = this.data.total
    let shopLists = this.data.shopLists

    var arr = [];
    var shopList, v;
    for (var i in shopLists) {
      arr.push(shopLists[i]);
    }
    for (v in arr) {
      shopList = arr[v].find(function (u) {
        return u.rec_id == data.id
      })
      if (shopList != undefined) {
        break;
      }
    }
    shopLists.total_price -= parseInt(shopList.goods_price)
    if (parseInt(shopLists.total_price) < 0) {
      shopLists.total_price += parseInt(shopLists.goods_price)
      return
    }
    shopList.goods_number = parseInt(shopList.goods_number) - 1
    if (parseInt(shopList.goods_number) < 1) {
      shopList.goods_number = parseInt(shopList.goods_number) + 1
      shopLists.total_price += parseInt(shopList.goods_price)
      return
    }


    //改变购物车商品数量
    wx.request({
      url: app.apiUrl('cart/update'),
      data: {
        id: data.id,
        amount: shopList.goods_number
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: 'POST',
      success: function () {
        that.onLoad()
      }
    })

  },
  del: function (event) {
    var that = this
    let data = event.currentTarget.dataset

    wx.showModal({
      title: '提示',
      content: '您确定要移除当前商品吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl('cart/delete'),
            data: {
              id: data.id
            },
            method: 'POST',
            header: {
              'Content-Type': 'application/json',
              'X-ECTouch-Authorization': token
            },
            success: function (res) {
              that.onShow()
            }
          })
        }
      }
    })
  },
  flowcartBtn: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },

  flowCheckoutBtn: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    wx.setStorageSync('flowcheckout', { from: "checkout" })
    if (that.data.is_first_action == true) {
      that.setData({
        is_first_action: false,
      })
      wx.request({
        url: app.apiUrl('user/address/list'),
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        success: function (res) {
          if (res.data.data != '') {
            wx.navigateTo({
              url: "../flow/checkout"
            });
          } else {
            wx.navigateTo({
              url: "../address/create"
            });
          }
        }
      })
    }
  },
})
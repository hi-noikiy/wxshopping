var app = getApp()
var token
var orderId;
Page({
  data: {
    index: 0,
    orderJtou: '../../images/icon-arrowdown.png',
    distributionJtou: '../../images/icon-arrowdown.png',
    checkList: [],
  },
  onLoad: function (options) {
    orderId = options.objectId
    // this.loadOrderDetail(orderId);
    //加载中
    this.loadingChange()
  },
  onShow: function () {
    token = wx.getStorageSync('token')
    this.loadOrderDetail(orderId)
  },
  loadOrderDetail: function (orderId) {
    var that = this

    //商品详细信息获取
    wx.request({
      url: app.apiUrl('user/order/detail'),
      data: {
        id: orderId,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var attr;
        var temp = '';
        for (var i in res.data.data.goods) {
          // attr = res.data.data.goods[i].goods_attr.split('\n')
          for (var j in attr) {
            if (attr[j] == '') continue;
            temp += attr[j] + ','
          }
          res.data.data.goods[i].goods_attr = temp.substring(0, temp.length - 1)
        }
        that.setData({
          goodsList: res.data.data.goods,
          orders: res.data.data,
        })
      }
    })
  },
  //确认收货
  confirm_order: function (e) {
    wx.showModal({
      title: '提示',
      content: '确认收到商品？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl('user/order/confirm'),
            data: {
              id: e.currentTarget.dataset.id
            },
            header: {
              'Content-Type': 'application/json',
              'X-ECTouch-Authorization': token
            },
            method: "POST",
            success: function (res) {
              if (res.data.code == 0) {
                wx.showToast({
                  title: res.data.msg,
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  image: '../../images/failure.png',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },

  siteDetail: function (e) {
    var that = this
    //获取点击的id值
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.goodsList[index].goods_id;
    wx.navigateTo({
      url: "../goods/index?objectId=" + goodsId
    });
  },
  //取消订单
  cancel_order: function (e) {
    var that = this
    var error_msg = '';
    wx.showModal({
      title: '提示',
      content: '确认取消订单？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl('user/order/cancel'),
            data: {
              id: orderId
            },
            header: {
              'Content-Type': 'application/json',
              'X-ECTouch-Authorization': token
            },
            method: "POST",
            success: function (res) {
              if (res.data.code > 0) {
                app.shwomessage('取消失败', 1000, 'clear')

              } else if (res.data.code == 0) {
                app.shwomessage('取消成功', 1000, 'warn')
                wx.navigateTo({
                  url: "../order/index?id=" + 0
                });
              }
            }
          })
          //
        }
      }
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
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  pay_order: function (e) {
    var formId_data = e.detail.formId
    var order_id = e.currentTarget.dataset.id
    var openid = wx.getStorageSync('openid')
    app.payOrder(order_id, openid, token, formId_data)
  },
})
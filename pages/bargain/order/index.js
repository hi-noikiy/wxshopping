//获取应用实例
var app = getApp()
var token
var openid;
var size = 30;
var page = 1;
var type="0"
Page({
  data: {
    current: "0",
    orders: [],
  },

  orderStatus: function (that, id) {
    wx.request({
      url: app.apiUrl('user/order/list'),
      data: {
        size: size,
        page: page,
        status: id,
        type:"bargain"
        
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        that.setData({
          orders: res.data.data,

        })
      }
    })
  },
  onLoad: function (e) {
    var that = this
    token = wx.getStorageSync('token')
    that.data.current = e.id || 0
    this.setData({
      current: that.data.current
    })
    this.orderStatus(this, that.data.current);
    //加载中
    this.loadingChange()
    //获取openid
  },
  /*订单导航内容切换*/
  bindHeaderTap: function (event) {
    this.setData({
      current: event.target.dataset.index,
    });
    this.loadingChange()
    this.orderStatus(this, event.target.dataset.index);

  },

  siteDetail: function (e) {
    var that = this
    //获取点击的id值
    var index = e.currentTarget.dataset.index;
    var orderId = that.data.orders[index].order_id;
    wx.navigateTo({
      url: "../order/detail?objectId=" + orderId
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
          //
          wx.request({
            url: app.apiUrl('user/order/cancel'),
            data: {
              id: e.currentTarget.dataset.id
            },
            header: {
              'Content-Type': 'application/json',
              'X-ECTouch-Authorization': token
            },
            method: "POST",
            success: function (res) {
              if (res.data.code > 0) {
                error_msg = '取消失败'

              } else if (res.data.code == 0) {
                error_msg = '取消成功'

                that.orderStatus(that, that.data.current);
              }
              wx.showToast({
                title: error_msg,
                icon: 'warn',
                duration: 500
              })
            }
          })
          //
        }
      }
    })

  },
  //支付
  pay_order: function (e) {
    var formId_data = e.detail.formId
    var that = this
    var order_id = e.currentTarget.dataset.id
    var openid = wx.getStorageSync('openid')
    app.payOrder(order_id, openid, token, formId_data)
    that.orderStatus(that, that.data.current);

  },
  //确认收货
  confirm_order: function (e) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认收到商品？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl('user/order/confirm '),
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
                that.orderStatus(that, that.data.current);
                wx.redirectTo({ url: 'order/index' })
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
    }, 1000)
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})









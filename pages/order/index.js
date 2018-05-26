//获取应用实例
var app = getApp()
var token
var openid;
var size = 100;
var page = 1;
var id = 0;

Page({
  data: {
    orders: [],
    hidden: false,
    bottomloading: false,
    ListPageNum: 1,// 设置加载的第几次，默认是第一次
    viewBox: false,
    current: 0
  },
  onLoad: function (e) {
    var that = this
    token = wx.getStorageSync('token')
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: (res.windowHeight)
        });
      }
    });
    if (e.id == 3) {
      if (that.data.commentList != '') {
        this.setData({
          hidden: true
        })
      }
      that.comment();
    }else{
      that.data.current = e.id || 0
      that.setData({
        current: that.data.current
      })
      page = 0
      that.orderStatus(that, that.data.current);
    }

    that.setData({
      current: e.id
    })

  },
  //事件处理函数
  orderStatus: function (that, id) {
    var that = this;
    wx.request({
      url: app.apiUrl('user/order/list'),
      data: {
        size: size,
        page: page,
        status: id,
        type: "0"
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        var lists = that.data.orders
        for (var i = 0; i < res.data.data.length; i++) {
          lists.push(res.data.data[i]);
        }
        that.setData({
          orders: lists,
        });
        page++;
        that.setData({
          hidden: true,
        });
      }
    })
  },
  comment: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/order/appraise"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          commentList: res.data.data
        })
      }
    })
  },
  /*订单导航内容切换*/
  bindHeaderTap: function (event) {
    var that = this
    that.setData({
      orders: [],
      current: event.target.dataset.index,
      scrollTop: 0,
      viewBox: false,
      commentList: ''
    });
    if (event.target.dataset.index != 3) {
      if (that.data.orders != '') {
        this.setData({
          hidden: true
        })
      }
      page = 1;
      that.orderStatus(that, event.target.dataset.index);
    } else {
      that.comment();
      if (that.data.commentList != '') {
        this.setData({
          hidden: true
        })
      }
    }
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
  //去评价
  commentBtn: function (e) {
    var that = this
    var oid = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.commentList[index].id;
    wx.navigateTo({
      url: "../order/comment?objectId=" + goodsId + "&oid=" + oid,
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
              console.log(res.data)
              if (res.data.code > 0) {
                error_msg = '取消失败'

              } else if (res.data.code == 0) {
                error_msg = '取消成功'
                that.setData({
                  orders: [],
                });
                page = 1
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
                  title: '确定完成',
                  duration: 2000
                })
                that.setData({
                  orders: [],
                });
                page = 1
                that.orderStatus(that, that.data.current);
                wx.redirectTo({ url: '../user/index' })
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
  navMore: function () {
    var that = this;
    that.setData({
      showViewNav: (!that.data.showViewNav)
    })
  },
  bargainNav: function (e) {
    wx.navigateTo({
      url: "../bargain/order/index"
    });
  },
  groupNav: function (e) {
    wx.navigateTo({
      url: "../group/order/index"
    });
  },
  bindDownLoad: function () {
    var that = this;
    this.setData({
      bottomloading: 'active',
    });
    if (that.data.isListData == true) {
      wx.request({
        url: app.apiUrl('user/order/list'),
        data: {
          size: size,
          page: page,
          status: id,
          type: "0"
        },
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        method: "POST",
        success: function (res) {
          var lists = that.data.orders
          for (var i = 0; i < res.data.data.length; i++) {
            lists.push(res.data.data[i]);
          }
          that.setData({
            orders: lists,
            bottomloading: '',
          });
          page++;
        }
      })
    } else {
      that.setData({
        bottomloading: '',
      })
    }
  },
  //滚动触发事件
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop,
      viewBox: true,
    });
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})









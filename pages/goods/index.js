var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
var order = {
  id: "",
  num: 1,
  pro: [],
  prostr: []
}
var goodsbtn = ''
var tempOrderPro = [];
var tempOrderProStr = [];
var coupons_index = '';
var newId = '';//接口返回值
Page({
  data: {
    hidden: false,
    hiddenOrder: false,
    hiddenAddress: true,
    is_collect: 0,
    currentIndex: 1,
    currentTab: 0,
    num: 1,
    goodsComment: [],
    properties: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    showView: true,
    scrollTop: 0,
    floorstatus: false,
    parameteCont: [],
  },

  onLoad: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    // 生命周期函数--监听页面加载
    // 获取用户数据
    var goodsId = options.objectId;
    order.id = goodsId
    //缓存商品
    var goodsid = wx.getStorageSync('goodsid')
    if (goodsid == '') {
      wx.setStorageSync('goodsid', goodsId)
    } else {
      wx.request({
        url: app.apiUrl("goods/save"),
        data: {
          list: (newId == '' ? goodsid : newId),
          goodsId: goodsId
        },
        method: "post",
        header: {
          'Content-Type': 'application/json',
          'X-ECTouch-Authorization': token
        },
        success: function (res) {
          newId = res.data.data
          wx.setStorageSync('goodshistory', newId)

        }
      })
    }


    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.apiUrl("goods/detail"),
      data: {
        "id": goodsId,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        wx.setNavigationBarTitle({
          title: res.data.data.goods_info.goods_name,
        })
        if (res.data.data != undefined) {
          WxParse.wxParse('goods_desc', 'html', res.data.data.goods_info.goods_desc, that, 5);
          that.setData({
            goodsCont: res.data.data,
            properties: res.data.data.goods_properties.pro,
            parameteCont: res.data.data.goods_properties.spe,
            goodsComment: res.data.data.goods_comment.slice(0, 3),
            flowNum: res.data.data.cart_number,
            collect_list: (res.data.data.goods_info.is_collect == 1) ? true : false,
            hidden: true
            // couponsData: (res.data.data.coupont[0].pick)
          })
          tempOrderPro = []
          tempOrderProStr = []
          //商品有属性则默认选中第一个
          for (var i in res.data.data.goods_properties.pro) {
            that.getProper(res.data.data.goods_properties.pro[i].values[0].id)
          }
          that.getGoodsTotal();
        }
      }
    })
  },
  onShow: function () {
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
    order.num = 1;
    order.pro = [];
    order.prostr =[];
  },
  /*提交*/
  goodsCheckout: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    //获取id
    var goodsbtn = e.currentTarget.id || 'cart'
    var goodsId = that.data.goodsCont.goods_id
    wx.request({
      url: app.apiUrl("cart/add"),
      data: {
        "id": order.id,
        "num": order.num,
        "attr_id": JSON.stringify(tempOrderPro),
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var result = res.data.data;
        if (goodsbtn == 'cart') {
          if (res.data.data == '库存不足') {
            wx.showToast({
              title: '库存不足',
              image: '../../images/failure.png',
              duration: 2000
            })
          } else {
            that.setData({
              flowNum: res.data.data.total_number
            })
          }
        }
        else {
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
                wx.removeStorageSync('pageOptions')
                wx.navigateTo({
                  url: "../address/index"
                });
              }
            }
          })
        }
        if (result == "商品已下架") {
          wx.showToast({
            title: '商品已下架',
            image: '../../images/failure.png',
            duration: 2000
          })
        }
      }
    })
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  /*增加商品数量*/
  up: function () {
    var num = this.data.num;
    num++;
    if (num >= 99) {
      num = 99
    }
    this.setData({
      num: num
    })
    order.num = num;
    this.getGoodsTotal();
  },
  /*减少商品数量*/
  down: function () {
    var num = this.data.num;
    num--;
    if (num <= 1) {
      num = 1
    }
    this.setData({
      num: num
    })
    order.num = num;
    this.getGoodsTotal();
  },
  /*手动输入商品*/
  import: function (e) {
    var that = this
    var stock = that.data.stock
    var num = Math.floor(e.detail.value);
    if (num <= 1) {
      num = 1
    }
    if (num >= stock) {
      num = stock
    }
    this.setData({
      num: num
    })
    order.num = num;
    this.getGoodsTotal();

  },
  /*单选*/
  modelTap: function (e) {
    console.log(e.currentTarget.id)
    this.getProper(e.currentTarget.id)
    this.getGoodsTotal();
  },
  /*属性选择计算*/
  getProper: function (id) {
    tempOrderPro = []
    tempOrderProStr = []
    var categoryList = this.data.properties;
    for (var index in categoryList) {
      for (var i in categoryList[index].values) {
        categoryList[index].values[i].checked = false;
        if (categoryList[index].values[i].id == id) {
          order.pro[categoryList[index].name] = id
          order.prostr[categoryList[index].name] = categoryList[index].values[i].label
        }
      }
    }

    //处理页面
    for (var index in categoryList) {
      if (order.pro[categoryList[index].name] != undefined && order.pro[categoryList[index].name] != '') {
        for (var i in categoryList[index].values) {
          if (categoryList[index].values[i].id == order.pro[categoryList[index].name]) {
            categoryList[index].values[i].checked = true;
          }
        }
      }
    }
    for (var l in order.pro) {
      tempOrderPro.push(order.pro[l]);
    }
    for (var n in order.prostr) {
      tempOrderProStr.push(order.prostr[n]);
    }

    this.setData({
      properties: categoryList,
      selectedPro: tempOrderProStr.join(',')
    });
  },
  getGoodsTotal: function () {
    //提交属性  更新价格
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("goods/property"),
      data: {
        id: order.id,
        attr_id: tempOrderPro,
        num: order.num,
        warehouse_id: "1",
        area_id: "1"
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          goods_price: res.data.data.goods_price_formated,
          stock: res.data.data.stock,
          attr_img: res.data.data.attr_img,
          goods_market_price: res.data.data.market_price_formated
        });

      }
    })
  },

  /*收藏*/
  addCollect: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/collect/add"),
      data: {
        "id": order.id,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          collect_list: res.data.data
        })
      }
    })
  },

  //商品相册
  setCurrent: function (e) {
    var that = this;
    if (e.detail.current > 0) {
      that.setData({
        currentTab: e.detail.current
      });
    } else {
      that.setData({
        currentTab: 0
      });
    }
    this.setData({
      currentIndex: e.detail.current + 1
    })
  },
  swichNav: function (e) {
    var that = this;

    that.setData({
      showViewvideo: (!that.data.showViewvideo)
      // currentTab: e.currentTarget.dataset.current
    });
  },
  imgPreview: function () { //图片预览
    const imgs = this.data.goodsCont.goods_img;
    console.log(this.data.goodsCont.goods_img)
    wx.previewImage({
      current: imgs[this.data.currentIndex - 1], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
  /**内容切换 */
  toOrder: function (res) {
    this.setData({
      hiddenOrder: false,
      hiddenAddress: true
    })
  },
  toAddress: function (res) {
    this.setData({
      hiddenOrder: true,
      hiddenAddress: false
    })
  },
  //选择属性
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  //店铺
  storeDetail: function (e) {
    var id = this.data.goodsCont.detail.user_id
    wx.redirectTo({
      url: "../store/index?objectId=" + id
    });
  },
  //优惠券
  onChangeShowCoupons: function () {
    var that = this;
    that.setData({
      showViewCoupons: (!that.data.showViewCoupons)
    })
  },
  //领取优惠券
  printCoupont: function (e) {
    var that = this;
    var token = wx.getStorageSync('token')
    coupons_index = e.currentTarget.dataset.index;
    var couId = that.data.goodsCont.coupont[coupons_index].cou_id;
    wx.request({
      url: app.apiUrl("goods/coupons"),
      data: {
        "cou_id": couId,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.status_code != 500) {
          if (res.data.data.error == 2) {
            wx.showToast({
              title: "领取成功!",
              duration: 2000
            })
          } else {
            wx.showToast({
              image: '../../images/failure.png',
              title: "已领取!",
              duration: 2000
            })
          }
        } else {
          wx.showToast({
            title: "已领取!",
            duration: 2000
          })
        }
        wx.request({
          url: app.apiUrl("goods/detail"),
          data: {
            "id": order.id,
          },
          method: "post",
          header: {
            'Content-Type': 'application/json',
            'X-ECTouch-Authorization': token
          },
          success: function (res) {
            that.setData({
              goodsCont: res.data.data,
            })
          }
        })
      }
    })
  },
  flowCart: function () {
    wx.switchTab({
      url: '../flow/index',
    });
  },

  //返回顶部
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
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
  bindSharing: function () {
    var that = this
    var goodsId = that.data.goodsCont.goods_info.goods_id
    wx.navigateTo({
      url: "../goods/speak?objectId=" + goodsId
    });
  },
  toChild: function () {
    var that = this
    var goodsId = that.data.goodsCont.goods_info.goods_id
    wx.navigateTo({
      url: "../goods/comment?objectId=" + goodsId
    })
  },
  //video
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
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
  //分享
  onShareAppMessage: function () {
    var that = this
    var goods_name = that.data.goodsCont.goods_info.goods_name
    return {
      title: goods_name,
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/goods/index?objectId=' + order.id
    }
  },
})









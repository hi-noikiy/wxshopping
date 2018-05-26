var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmap = new QQMapWX({ key: "XSYBZ-P2G34-3K7UB-XPFZS-TBGHT-CXB4U" })
var util = require('../../utils/util.js')
var token
Page({
  /**
   * 首页数据控制
   * indicatorDots:是否显示面板指示点
   * autoplay 是否自动切换,
   * interval 自动切换时间间隔
   * duration 滑动动画时长
   * scrollTop 顶部
   * hasLocation 定位是否开启
   */
  data: {
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    scrollTop: 0,
    hasLocation: false,
    hidden: false
  },
  onShow: function () {
    var that = this
    token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
    //初始化onLoad
    //获取导航数据
    util.getIndexNav(function (arr) {
      that.setData({
        navList: arr
      })
    });
    that.index();
    setTimeout(() => {
      that.category();
      if (wx.getStorageSync('region') == '') {
        app.region()
      }
    }, 2000)
    that.getLocation();
  },
  index: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("index"),
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
      },
    })
  },
  category: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("category"),
      method: "post",
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.setStorageSync('cate_data', res.data.data);
      }
    })
  },
  //定位
  chooseLocation: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.chooseLocation({
      success: function (res) {
        wx.setStorageSync('currentPosition', res)
        var lat = res.latitude;
        var lon = res.longitude;
        qqmap.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lon
          },
          success: function (res) {
            wx.request({
              url: app.apiUrl('location/specific'),
              data: {
                address: res.result.address_component.city,
              },
              method: 'POST',
              header: {
                'Content-Type': 'application/json',
                'X-ECTouch-Authorization': token
              },
              success: function (res) {
                that.setData({
                  address: res.address,
                })
              }
            })
            var addess
            if (res.result.address_component.province == res.result.address_component.city) {
              addess = res.result.address_component.city
            } else {
              addess = res.result.address_component.city
            }
            that.setData({
              hasLocation: true,
              address: addess,
            })
          },
          fail: function (res) {
          },
        });

      }
    })
  },
  //获取当前定位
  getLocation: function () {
    var that = this
    wx.getLocation({
      success: function (res) {
        //缓存当前位置坐标
        var value = wx.getStorageSync('currentPosition')
        if (value) {
          that.transformRegion(value)
        } else {
          wx.setStorageSync('currentPosition', res)
          that.transformRegion(res)
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '温馨提示',
          content: '不允许定位,会对地区商品价格有影响，请确认，去重新允许！',
          success: function (res) {
            if (res.confirm) {
              wx.getSetting({
                success(res) {
                  wx.openSetting({
                    success: function (res) {
                      if (!res.authSetting["scope.userLocation"]) {
                        that.getLocation()
                      } else {
                        wx.getLocation({
                          success: function (res) {
                            //缓存当前位置坐标
                            var value = wx.getStorageSync('currentPosition')
                            if (value) {
                              that.transformRegion(value)
                            } else {
                              wx.setStorageSync('currentPosition', res)
                              that.transformRegion(res)
                            }
                          },
                        })
                      }
                    }
                  })
                },
              })
            } else if (res.cancel) {
              that.getLocation()
            }
          },
        })
      },
    })
  },
  transformRegion: function (res) {
    var that = this
    var lat = res.latitude;
    var lon = res.longitude;
    qqmap.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      success: function (res) {
        var addess
        if (res.result.address_component.province == res.result.address_component.city) {
          addess = res.result.address_component.city
        } else {
          addess = res.result.address_component.city
        }
        that.setData({
          hasLocation: true,
          address: addess,
        })
      },
      fail: function (res) {
      },
    });
  },
  //返回顶部
  goTop: function (e) {
    this.setData({
      scrollTop: 0
    })
  },
  scroll: function (e) {
    this.setData({
      indexSearch: e.detail.scrollTop
    });
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
  //分享
  onShareAppMessage: function () {
    return {
      title: '小程序首页',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/index/index'
    }
  }
})
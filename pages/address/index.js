var app = getApp()
var WeChatList;
var userName, provinceName, cityName, countyName, telNumber, detailInfo
Page({
  data: {
    addressList: [],
    is_first_action: true,
    hidden: false
  },
  onLoad: function (options) {
    this.getAddressList();
  },
  onShow: function () {
    this.getAddressList();
    this.setData({
      is_first_action: true,
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getAddressList: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl('user/address/list'),
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var addressList = res.data.data
        if (res.data.data != undefined) {
          for (var i in res.data.data) {
            WeChatList = {
              userName: addressList[i].consignee,
              provinceName: addressList[i].province_name,
              cityName: addressList[i].city_name,
              countyName: addressList[i].district_name,
              telNumber: addressList[i].mobile,
              detailInfo: addressList[i].address
            }
          }
          if (res.data.code == 0) {
            that.setData({
              addressList: res.data.data,
              hidden: true
            });
          }
        }
      }
    })
  },
  // 添加收货地址
  createAddress: function () {
    wx.navigateTo({
      url: './create'
    })
  },
  // 编辑收货地址
  editAddress: function (e) {
    var that = this
    var address_index = e.currentTarget.dataset.address
    var address_id = that.data.addressList[address_index].id
    if (that.data.is_first_action == true) {
      that.setData({
        is_first_action: false,
      })
      wx.navigateTo({
        url: "../address/detail?objectId=" + address_id
      })
    }
  },
  // 删除收货地址
  removeAddress: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var address_id = e.currentTarget.dataset.address
    wx.showModal({
      title: '提示',
      content: '您确定要移除当前收货地址吗?',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.apiUrl('user/address/delete'),
            method: 'POST',
            header: {
              'X-ECTouch-Authorization': token
            },
            data: {
              id: address_id
            },
            success: function () {
              var options = wx.getStorageSync('pageOptions')
              that.onLoad(options);
            }
          })
        }
      }
    })
  },
  //设置默认地址


  // 设置默认地址
  setDefault: function (e) {
    var that = this
    var address_id = e.detail.value
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl('user/address/choice'),
      method: 'POST',
      header: {
        'X-ECTouch-Authorization': token
      },
      data: {
        id: address_id
      },
      success: function () {
        wx.showToast({
          title: '设置成功',
          success: function () {
            var options = wx.getStorageSync('flowcheckout')
            var options_user = wx.getStorageSync('address')
            that.onLoad(options)
            if (options.from == 'checkout') {
              wx.reLaunch({
                url: '../flow/checkout'
              })
            }
            if (options.from == 'user') {
              wx.reLaunch({
                url: '../user/index'
              })

            }
          }
        })
      }
    })
  },
  //获取微信地址
  addressChoose: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          console.log(res)
          var postdata = {
            consignee: res.userName,
            province: res.provinceName,
            city: res.cityName,
            district: res.countyName,
            mobile: res.telNumber,
            address: res.detailInfo,
          }
          if (WeChatList.userName != postdata.consignee && WeChatList.provinceName != postdata.province && WeChatList.cityName != postdata.city && WeChatList.countyName != postdata.district && WeChatList.telNumber != postdata.mobile && WeChatList.detailInfo != postdata.address) {
            wx.request({
              url: app.apiUrl('user/address/add'),
              method: 'post',
              header: {
                'X-ECTouch-Authorization': token
              },
              data: postdata,
              success: function (res) {
              }
            })
          } else {
            wx.showToast({
              title: '此地址已添加',
              image: '../../images/failure.png',
              duration: 2000
            })
          }
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
})
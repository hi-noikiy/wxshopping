// component/header.js
var app = getApp();
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
var qqmap = new QQMapWX({ key: "XSYBZ-P2G34-3K7UB-XPFZS-TBGHT-CXB4U" })
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    fixed: Boolean,
    color: {
      type: String,
      value: '#000'
    },
    backgroundColor: {
      type: String,
      value: 'transparent'
    },
    back: {
      type: null,
      value: false
    },
    address:{
      type: String,
      value:"kong"
    },
    dingwei: Boolean,
    align:{
      type: String,
      value: "center"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isx: /iphone10|iphone x/i.test(wx.getSystemInfoSync().model),
    isAndroid: /android/i.test(wx.getSystemInfoSync().system)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backFunction: function () {
      console.log("点击了back")
      wx.navigateBack({
        delta: this.data.back
      })
    },
    chooseLocation:function(){
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
              console.log(res)
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
  }
})

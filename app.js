//app.js
App({
  // 设置服务端API
  apiUrl: function (api) {
    return 'https://b2b.2418.cn/mobile/public/api/wx/' + api;
  },
  shwomessage: function (msg, time = 1000, icon = 'warn') {
    wx.showToast({
      title: msg,
      icon: icon,
      duration: time
    })
  },
  redirectTo: function (url) {
    wx.navigateTo({
      url: url
    });
  },
  payOrder: function (order_id, openid, token, formId_data) {
    var that = this
    wx.request({
      url: that.apiUrl('payment/pay'),
      data: {
        id: order_id,
        open_id: openid,
        code: 'order.pay',
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      method: "POST",
      success: function (res) {
        if (res.data.status_code == 500) {
          wx.showToast({
            title: '支付失败',
            image: '../../images/failure.png',
            duration: 2000
          })
          return
        }
        var wxpayinfo = res.data.data.wxpay
        if (wxpayinfo == '') {
          return
        }
        //发起支付
        wx.requestPayment({
          'timeStamp': wxpayinfo.timestamp,
          'nonceStr': wxpayinfo.nonce_str,
          'package': wxpayinfo.packages,
          'signType': 'MD5',
          'paySign': wxpayinfo.sign,
          'success': function (payres) {
            if (payres.errMsg == 'requestPayment:ok') {
              //成功修改订单状态
              wx.request({
                url: that.apiUrl('payment/notify'),
                data: {
                  "id": order_id,
                  form_id: formId_data
                },
                method: "post",
                header: {
                  'Content-Type': 'application/json',
                  'X-ECTouch-Authorization': token
                },
                success: function (res) {
                  if (res.data.data.code == 0) {
                    wx.showToast({
                      title: '支付成功',
                      duration: 2000
                    })
                    if (res.data.data.extension_code == '') {
                      that.redirectTo('../order/index?objectId=' + order_id)
                    }
                    if (res.data.data.extension_code == 'team_buy') {
                      that.redirectTo('../group/wait?objectId=' + res.data.data.team_id + "&user_id=" + res.data.data.user_id)
                    }
                    if (res.data.data.extension_code == 'bargain_buy') {
                      that.redirectTo('../bargain/order/index?objectId=' + order_id)
                    }
                  } else {
                    wx.showToast({
                      title: '付款失败',
                      image: '../../images/failure.png',
                      duration: 2000
                    })
                  }
                }
              })
            }
          },
          'fail': function (payres) {
            wx.showToast({
              title: '支付失败',
              image: '../../images/failure.png',
              duration: 2000
            })
            that.redirectTo('../order/index?objectId=' + order_id)

          }
        })

      }
    })
  },
  //地区接口
  region: function () {
    var that = this
    var areaInfo = [];
    var token = wx.getStorageSync('token')
    wx.request({
      url: that.apiUrl('region/list'),
      data: {
        id: 1
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var province = res.data.data //数组
        var provinceName = []//存放循环出数组中的值
        var provinceId = []
        for (var i = 0; i < province.length; i++) {
          provinceName = province[i].region_name;
          provinceId = province[i].region_id
          var provinceList = {
            'province_id': provinceId,
            'city_id': 0,
            'county_id': 0,
            'region_name': provinceName,
            'region_id': provinceId
          }
          areaInfo.push(provinceList)
          //取出所有市的数据
          var city = province[i].region;
          var cityName = [], city_id
          for (var j = 0; j < city.length; j++) {
            cityName = city[j].region_name;
            city_id = city[j].region_id
            var cityList = {
              'province_id': provinceId,
              'city_id': j + 1,
              'county_id': 0,
              'region_name': cityName,
              'region_id': city_id
            }
            areaInfo.push(cityList)
            var countyName = [], county_id
            var county = city[j].region
            for (var v = 0; v < county.length; v++) {
              countyName = county[v].region_name;//取出所有区
              county_id = county[v].region_id;
              var countyList = {
                'province_id': provinceId,
                'city_id': j + 1,
                'county_id': v + 1,
                'region_name': countyName,
                'region_id': county_id
              }
              areaInfo.push(countyList)
            }
          }
        }
        wx.setStorageSync('region', areaInfo)
      }
    })
  }
})


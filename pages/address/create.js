var app = getApp()
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var t = 0;
var show = false;
var moveY = 200;
var changeValue, changeProvince, changeCity, changeCounty, changeProvince_id, changeCity_id, changeCounty_id, checkout, region_list
Page({
  data: {
    show: show,
    province: provinces,
    city: citys,
    county: countys,
    province_id: provinces,
    city_id: citys,
    county_id: countys,
    value: [0, 0, 0]
  },
  onLoad: function (options) {
    var that = this
    checkout = wx.getStorageSync('flowcheckout')
    areaInfo = wx.getStorageSync('region')
    getProvinceData(that)
    //初始化动画
    that.animation = wx.createAnimation({
      transformOrigin: "50% 50%",
      duration: 0,
      timingFunction: "ease",
      delay: 0
    }
    )
    that.animation.translateY(200 + 'vh').step();
    that.setData({
      animation: that.animation.export(),
      show: show
    })
  },

  //滑动事件
  bindChange: function (e) {
    var val = e.detail.value//[0,0,0,]省市区的下标
    if (index[0] != val[0]) {
      val[1] = 0;
      val[2] = 0;
      getCityArr(val[0], this);//获取地级市数据
      getCountyInfo(val[0], val[1], this);//获取区县数据
    } else {    //若省份column未做滑动，地级市做了滑动则定位区县第一位
      if (index[1] != val[1]) {
        val[2] = 0;
        getCountyInfo(val[0], val[1], this);//获取区县数据
      }
    }
    index = val;
    //存储滑动后的数据
    changeValue = [val[0], val[1], val[2]]
    changeProvince = provinces[val[0]].region_name
    changeCity = citys[val[1]].region_name
    changeCounty = countys[val[2]].region_name
    changeProvince_id = provinces[val[0]].region_id
    changeCity_id = citys[val[1]].region_id
    changeCounty_id = countys[val[2]].region_id
  },
  //确定
  checkFloatView(e) {
    var that = this
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    this.setData({
      value: changeValue,
      province: (changeProvince == undefined ? '' : changeProvince),
      city: (changeCity == undefined ? '' : changeCity),
      county: (changeCounty == undefined ? '' : changeCounty),
      province_id: (changeProvince_id == undefined ? '0' : changeProvince_id),
      city_id: (changeCity_id == undefined ? '0' : changeCity_id),
      county_id: (changeCounty_id == undefined ? '0' : changeCounty_id),
      showViewMol: !that.data.showViewMol,
    })
  },
  //隐藏弹窗浮层
  hiddenFloatView(e) {
    var that = this
    moveY = 200;
    show = true;
    t = 0;
    animationEvents(this, moveY, show);
    that.setData({
      showViewMol: !that.data.showViewMol,
    })
  },
  //移动按钮点击事件
  translate: function (e) {
    var that = this
    if (t == 0) {
      moveY = 0;
      show = false;
      t = 1;
    } else {
      moveY = 200;
      show = true;
      t = 0;
    }
    // this.animation.translate(arr[0], arr[1]).step();
    animationEvents(this, moveY, show);
    //初始化数据
    changeValue = [0, 0, 0]
    changeProvince = '北京'
    changeCity = '北京'
    changeCounty = '东城区'
    changeProvince_id = '2'
    changeCity_id = '52'
    changeCounty_id = '500'
    that.setData({
      showViewMol: !that.data.showViewMol,
    })
  },
  //信息提交
  saveData: function (e) {
    var that = this
    var data = e.detail.value;
    var token = wx.getStorageSync('token')
    var postdata = {
      consignee: data.consignee,
      province: that.data.province_id,
      city: that.data.city_id,
      district: that.data.county_id,
      mobile: data.mobile,
      address: data.address
    }
    wx.request({
      url: app.apiUrl('user/address/add'),
      method: 'post',
      header: {
        'X-ECTouch-Authorization': token
      },
      data: postdata,
      success: function (res) {
        var result = res.data.status_code
        var myreg = /^1(3[0-9]|4[0-9]|5[0-35-9]|6[6]|7[01345678]|8[0-9]|9[89])\d{8}$/;
        var mobile = data.mobile
        if (result == 500) {
          if (data.consignee == '') {
            wx.showToast({
              title: '收件人不能为空',
              image: '../../images/failure.png',
              duration: 2000,
            })
            return false;
          }
          if (mobile.length == 0) {
            wx.showToast({
              title: '手机号不能为空',
              image: '../../images/failure.png',
              duration: 2000,
            })
            return false;
          }
          if (mobile.length != 11) {
            wx.showToast({
              title: '手机号长度有误',
              image: '../../images/failure.png',
              duration: 1500
            })
            return false;
          }
          if (!myreg.test(mobile)) {
            wx.showToast({
              title: '手机号不符合要求',
              image: '../../images/failure.png',
              duration: 1500
            })
            return false;
          }
          if (that.data.province == '' && that.data.city == '' && that.data.county == '') {
            wx.showToast({
              title: '省市区不能空',
              image: '../../images/failure.png',
              duration: 2000,
            })
            return false;
          }
          if (data.address == '') {
            wx.showToast({
              title: '详细地址不能为空',
              image: '../../images/failure.png',
              duration: 2000,
            })
            return false;
          }
        } else {
          // wx.showToast({
          //   title: '保存成功',
          //   duration: 2000,
          //   success: function () {
          //     // wx.navigateBack({
          //     //   delta: 1
          //     // })
          //     wx.redirectTo({ url: './index' })
          //   }
          // })
          wx.showToast({
            title: '保存成功',
            duration: 2000,
            success: function () {
              if (checkout.from == 'checkout') {
                wx.redirectTo({
                  url: '../address/index'
                })
              }
              if (checkout.from == 'user') {
                wx.navigateBack({
                  delta: 1
                })
              }

            }
          })
        }
      }
    })
  },
  //清空表单
  formReset: function () {
    this.setData({
      value: '',
      province: '',
      city: '',
      county: '',
      province_id: '',
      city_id: '',
      county_id: ''
    })
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
//动画事件
function animationEvents(that, moveY, show) {
  // console.log("moveY:" + moveY + "\nshow:" + show);
  that.animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 400,
    timingFunction: "ease",
    delay: 0
  }
  )
  that.animation.translateY(moveY + 'vh').step()

  that.setData({
    animation: that.animation.export(),
    show: show
  })

}

//获取省份数据
function getProvinceData(that) {
  var s;
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    s = areaInfo[i];
    if (s.city_id == 0 && s.county_id == 0) {
      provinces[num] = s;
      num++;
    }
  }
  that.setData({
    provinces: provinces
  })
  //初始化调一次
  getCityArr(0, that);
  getCountyInfo(0, 0, that);
}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.county_id == "00" && c.province_id == provinces[count].province_id && c.city_id != "00") {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }
  that.setData({
    citys: citys,
    value: [count, 0, 0]
  })
}

// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.county_id != "00" && c.province_id == provinces[column0].province_id && c.city_id == citys[column1].city_id) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    countys: countys,
    value: [column0, column1, 0]
  })
}
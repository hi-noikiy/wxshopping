var app = getApp()
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var t = 0;
var show = false;
var moveY = 200;
var address_id;
var provinceIndex, citysIndex, countyIndex;
var changeValue, changeProvince, changeCity, changeCounty, changeProvince_id, changeCity_id, changeCounty_id
Page({
  data: {
    hidden: false,
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
    var token = wx.getStorageSync('token')
    address_id = options.objectId;
    //获取地区选择数据
    areaInfo = wx.getStorageSync('region')
    that.addressData();
    //初始化动画层
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
  //地址详细信息
  addressData: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl('user/address/detail'),
      data: {
        id: address_id
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        getProvinceData(that)
        if (res.data.data != undefined) {
          var provinceId = res.data.data.address.province_id
          var cityId = res.data.data.address.city_id
          var countyId = res.data.data.address.district_id
          provinceIndex = 0
          citysIndex = 0
          countyIndex = 0
          for (let i = 0; i < that.data.provinces.length; i++) {
            if (that.data.provinces[i].province_id == provinceId) {
              provinceIndex = i
            }
          }
          getCityArr(provinceIndex, that);
          for (let i = 0; i < that.data.citys.length; i++) {
            if (that.data.citys[i].region_id == cityId) {
              citysIndex = i
            }
          }
          getCountyInfo(provinceIndex, citysIndex, that);
          for (let i = 0; i < that.data.countys.length; i++) {
            if (that.data.countys[i].region_id == countyId) {
              countyIndex = i
            }
          }
          that.setData({
            value: [provinceIndex, citysIndex, countyIndex]
          })
          that.setData({
            addressDeatil: res.data.data,
            consignee: res.data.data.consignee,
            mobile: res.data.data.mobile,
            address: res.data.data.address,
            province: res.data.data.address.province,
            city: res.data.data.address.city,
            county: res.data.data.address.district,
            province_id: res.data.data.address.province_id,
            city_id: res.data.data.address.city_id,
            county_id: res.data.data.address.district_id,
            hidden: true
          })
        }
      }
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
    this.setData({
      value: [val[0], val[1], val[2]],
    })
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
      // value: [provinceIndex, citysIndex, countyIndex],
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

  saveData: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    var data = e.detail.value;
    var postdata = {
      consignee: data.consignee,
      province: that.data.province_id,
      city: that.data.city_id,
      district: that.data.county_id,
      mobile: data.mobile,
      address: data.address,
      id: address_id,
    }
    wx.request({
      url: app.apiUrl('user/address/update'),
      method: 'post',
      header: {
        'X-ECTouch-Authorization': token
      },
      data: postdata,
      success: function (res) {
        var mobile = data.mobile
        var result = res.data
        var myreg = /^1(3[0-9]|4[0-9]|5[0-35-9]|6[6]|7[01345678]|8[0-9]|9[89])\d{8}$/;
        if (!myreg.test(mobile)) {
          wx.showToast({
            title: '手机号不符合要求',
            image: '../../images/failure.png',
            duration: 1500
          })
          return false;
        }
        if (res.data.code != 0) {
          wx.showToast({
            title: '更新失败',
            image: '../../images/failure.png',
            duration: 2000,
          })
        } else {
          wx.showToast({
            title: '保存成功',
            duration: 2000,
            success: function () {
              wx.navigateBack({
                delta: 1
              })
              wx.redirectTo({ url: './index' })
            }
          })
        }
      }
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
  provinces = [];
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

}

// 获取地级市数据
function getCityArr(count, that) {
  var c;
  citys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.county_id == 0 && c.province_id == provinces[count].province_id && c.city_id != 0) {
      citys[num] = c;
      num++;
    }
  }
  if (citys.length == 0) {
    citys[0] = { name: '' };
  }

  that.setData({
    citys: citys
  })
}
// 获取区县数据
function getCountyInfo(column0, column1, that) {
  var c;
  countys = [];
  var num = 0;
  for (var i = 0; i < areaInfo.length; i++) {
    c = areaInfo[i];
    if (c.county_id != 0 && c.province_id == provinces[column0].province_id && c.city_id == citys[column1].city_id) {
      countys[num] = c;
      num++;
    }
  }
  if (countys.length == 0) {
    countys[0] = { name: '' };
  }
  that.setData({
    countys: countys,
    // value: [column0, column1, 0]
  })
}
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
    })
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
      url: app.apiUrl("user/invoice/detail"),
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        getProvinceData(that)
        var provinceId = res.data.data.invoice.province
        var cityId = res.data.data.invoice.city
        var countyId = res.data.data.invoice.district
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
          id: res.data.data.invoice.id,
          company_name: res.data.data.invoice.company_name,
          tax_id: res.data.data.invoice.tax_id,
          company_address: res.data.data.invoice.company_address,//注册地址
          company_telephone: res.data.data.invoice.company_telephone,//注册电话
          consignee_name: res.data.data.invoice.consignee_name,//收票人姓名
          consignee_mobile_phone: res.data.data.invoice.consignee_mobile_phone,//收票人电话
          consignee_address: res.data.data.invoice.consignee_address,//收票人地址
          bank_of_deposit: res.data.data.invoice.bank_of_deposit,//开户行
          bank_account: res.data.data.invoice.bank_account,//银行账户
          invoice: res.data.data.invoice,
          province: res.data.data.invoice.province_name,
          city: res.data.data.invoice.city_name,
          county: res.data.data.invoice.district_name
        })
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
  //提交信息
  formSubmit: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    //获得表单数据
    var formData = e.detail.value;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (formData.company_name == '') {
      wx.showToast({
        title: '单位名称不能为空',
        image: '../../images/failure.png',
        duration: 2000,
      })
      return false;
    }
    if (formData.tax_id == '') {
      wx.showToast({
        title: '纳税人识别码不能为空',
        image: '../../images/failure.png',
        duration: 2000,
      })
      return false;
    }
    if (formData.company_address == '') {
      wx.showToast({
        title: '注册地址不能为空',
        image: '../../images/failure.png',
        duration: 2000,
      })
      return false;
    }
    if (formData.company_telephone.length == 0 || formData.consignee_mobile_phone.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        image: '../../images/failure.png',
        duration: 2000,
      })
      return false;
    }
    if (formData.consignee_mobile_phone.length != 11) {
      wx.showToast({
        title: '手机号长度有误',
        image: '../../images/failure.png',
        duration: 1500
      })
      return false;
    }

    if (!myreg.test(formData.consignee_mobile_phone)) {
      wx.showToast({
        title: '手机号不符合要求',
        image: '../../images/failure.png',
        duration: 1500
      })
      return false;
    }

    var postdata = {
      id: that.data.id,
      company_name: formData.company_name,//单位名称
      tax_id: formData.tax_id,//识别码
      company_address: formData.company_address,//注册地址
      company_telephone: formData.company_telephone,//注册电话
      consignee_name: formData.consignee_name,//收票人姓名
      consignee_mobile_phone: formData.consignee_mobile_phone,//收票人电话
      consignee_address: formData.consignee_address,//收票人地址
      bank_of_deposit: formData.bank_of_deposit,//开户行
      bank_account: formData.bank_account,//银行账户
      province: that.data.province_id,
      city: that.data.city_id,
      district: that.data.county_id,
    }
    wx.request({
      url: app.apiUrl("user/invoice/update"),
      method: "POST",
      data: postdata,
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        wx.showToast({
          title: '更新成功',
          duration: 2000
        })
        wx.redirectTo({ url: '../invoice/detail' })
      }
    })
  }
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
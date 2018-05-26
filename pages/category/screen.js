var app = getApp()
var areaInfo = [];//所有省市区县数据
var provinces = [];//省
var citys = [];//城市
var countys = [];//区县
var index = [0, 0, 0];
var t = 0;
var show = false;
var moveY = 200;
var changeValue, changeProvince, changeCity, changeCounty, changeProvince_id, changeCity_id, changeCounty_id
var brand, cateId, id, itemId;
var fil_key = [];
var region
Page({
  data: {
    show: show,
    province: provinces,
    city: citys,
    county: countys,
    province_id: provinces,
    city_id: citys,
    county_id: countys,
    value: [0, 0, 0],
    showView: true,
    proprietary: 0,//默认不是自营
    brandName: '',
    numHide: 0,
  },
  onLoad: function (options) {
    var that = this
    region = wx.getStorageSync('region')
    id = options.objectId;
    areaInfo = wx.getStorageSync('region')
    getProvinceData(that)
  },
  onShow: function (options) {
    var that = this
    var token = wx.getStorageSync('token')
    brand = wx.getStorageSync('brand');
    if (brand) {
      that.setData({
        brandsCate: brand
      });
    }
    //请求品牌
    wx.request({
      url: app.apiUrl('goods/filtercondition'),
      data: {
        cat_id: id,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data.data.filter) {
          for (var i = 0; i < res.data.data.filter.length; i++) {
            res.data.data.filter[i].id = i + 1
            res.data.data.filter[i].radio_name = ''
          }
        }
        wx.setStorageSync('brand', res.data.data.brand);
        that.setData({
          brandsCate: res.data.data.brand,
          filterData: res.data.data.filter
        });
      }
    })

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

    that.loadingChange()
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
    changeProvince_id = 2
    changeCity_id = 52
    changeCounty_id = 500
    that.setData({
      showViewMol: !that.data.showViewMol,
    })
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 2000)
  },

  //品牌显示隐藏
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },

  //尺码、颜色
  onChangeSize: function (event) {
    var that = this
    var that = this;
    var toggleBtnVal = that.data.numHide;//0
    itemId = event.currentTarget.id;//1、2、3
    if (toggleBtnVal == itemId) {
      that.setData({
        numHide: 0
      })
    } else {
      //点击后首次进入
      that.setData({
        numHide: itemId
      })
    }
  },
  //选择值
  radioChangeSize: function (e) {
    var that = this
    for (var i = 0; i < that.data.filterData.length; i++) {
      if (that.data.filterData[i].id == itemId) {
        that.data.filterData[i].radio_name = e.detail.value
      } else {
        that.data.filterData[i].radio_name = ''
      }
    }
    that.setData({
      filterData: that.data.filterData,
      showSize: (!that.data.showSize)
    })
  },
  //品牌选择
  radioChange: function (e) {
    var that = this
    that.setData({
      brandName: e.detail.value,
      showView: (!that.data.showView)
    })
  },
  //价格显示隐藏
  onChangeShowPrice: function () {
    var that = this;
    that.setData({
      showPrice: (!that.data.showPrice)
    })
  },
  //价格区间
  priceChange: function (e) {
    var that = this
    that.setData({
      pricenName: e.detail.value,
    })
  },
  //价格选择样式
  tagPrice: function (e) {
    var that = this
    var id = e.currentTarget.dataset.id;
    //设置当前样式
    that.setData({
      'currentPrice': id
    })
  },
  //自营选择
  switch2Change: function (e) {
    var that = this
    if (e.detail.value == true) {
      that.setData({
        proprietary: 1
      })
    } else {
      that.setData({
        proprietary: 2
      })
    }
  },
  //确定跳转
  formSubmit: function (e) {
    var that = this
    var data = e.detail.value;
    var token = wx.getStorageSync('token')
    var proprietary = that.data.proprietary;
    var price_min = e.detail.value.price_min;
    var price_max = e.detail.value.price_max;
    var brand = that.data.brandName;
    var province_id = that.data.province_id;
    var city_id = that.data.city_id;
    var county_id = that.data.county_id;
    if (that.data.filterData) {
      for (var i = 0; i < that.data.filterData.length; i++) {
        fil_key[i] = that.data.filterData[i].radio_name
      }
    } else {
      fil_key = ''
    }
    wx.navigateTo({
      url: "../category/product_list?objectId=" + proprietary + "&price_min=" + price_min + "&price_max=" + price_max + "&brand=" + brand + "&province_id=" + province_id + "&city_id=" + city_id + "&county_id=" + county_id + "&id=" + id + "&fil_key=" + fil_key,
    });
  },
  //清空表单
  formReset: function () {
    var that = this
    if (that.data.filterData) {
      for (var i = 0; i < that.data.filterData.length; i++) {
        that.data.filterData[i].radio_name = ''
      }
    }
    this.setData({
      value: '',
      province: '',
      city: '',
      county: '',
      province_id: '',
      city_id: '',
      county_id: '',
      brandName: '',
      fil_key: '',
      filterData: that.data.filterData,
    })
  },
})

//动画事件
function animationEvents(that, moveY, show) {
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
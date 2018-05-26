var app = getApp()
Page({
  data: {
    searchColor: 'rgba(0,0,0,0.4)',
    searchSize: '16',
    searchName: "搜索商品",
    hidden: false,
    curNav: 1,
    curIndex: 0,
    cateData: [],
  },
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
  },
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    // 获取缓存数据
    var cateCont = wx.getStorageSync('cate_data');
    if (cateCont) {
      that.setData({
        cateData: cateCont,
        curNav: cateCont[0].id
      })
    } else {
      wx.request({
        url: app.apiUrl("category"),
        method: "post",
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          wx.setStorageSync('cate_data', res.data.data);
          that.setData({
            cateData: res.data.data,
            curNav: res.data.data[0].id,
          })
        }
      })
    }
  },
  //事件处理函数
  //获取相对应的索引
  selectNav(event) {
    let id = event.target.dataset.id,
      index = parseInt(event.target.dataset.index);
    self = this;
    this.setData({
      curNav: id,
      curIndex: index,
      scrollTop: 0
    })
  },
  //分享
  onShareAppMessage: function () {
    return {
      title: '全部分类',
      desc: '小程序本身无需下载，无需注册，不占用手机内存，可以跨平台使用，响应迅速，体验接近原生App',
      path: '/pages/categroy/index'
    }
  }
})





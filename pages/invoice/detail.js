var app = getApp();
var token
Page({
  data: {
  },
  onLoad: function () {
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
        console.log(res.data.status_code)
        that.setData({
          invoices: res.data.data.invoice,
          invoice_id: res.data.data.invoice.id,
          status_code: res.data.status_code
        })
      }
    })
    //加载中
    this.loadingChange();
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
  },
  del: function (e) {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/invoice/delete"),
      method: "POST",
      data: {
        id: that.data.invoice_id
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data.code == 0){
          wx.showToast({
            title: '删除成功',
            duration: 2000
          })
          wx.redirectTo({ url: '../invoice/create' })
        }
      }
    })
  },
  update:function(e){
    var that = this
    var token = wx.getStorageSync('token')
    var invoice_id = that.data.invoice_id
    wx.navigateTo({
      url: "../invoice/update?objectId=" + invoice_id
    })
  }
})  
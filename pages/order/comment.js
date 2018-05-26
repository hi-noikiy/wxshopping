//index.js  
//获取应用实例  
var app = getApp()
const AV = require('../../utils/av-weapp.js');
var token
var goodsId
var oid
var rank
Page({
  data: {
    tempFilePaths: '',
    stars: [0, 1, 2, 3, 4],
    normalSrc: '../../images/normal.png',
    selectedSrc: '../../images/selected.png',
    key: 0,//评分
  },
  onLoad: function (options) {
    var that = this
    var goodsId = options.objectId;
    var oid = options.oid;
    token = wx.getStorageSync('token')

    wx.request({
      url: app.apiUrl("user/order/appraise/detail"),
      method: "POST",
      data: {
        gid: goodsId,
        oid: oid
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          goods_thumb: res.data.data.goods_thumb,
          goods_name: res.data.data.goods_name,
          goods_price: res.data.data.goods_price,
          goods_id: res.data.data.goods_id,
          order_id: res.data.data.order_id
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
  chooseimage: function () {
    var _this = this;
    wx.chooseImage({
      count: 2, // 默认9  
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        console.log(res.tempFilePaths)
        _this.setData({
          tempFilePaths: res.tempFilePaths
        })
        var tempFilePath = res.tempFilePaths[0];
        // wx.previewImage({
        //   current: '', // 当前显示图片的http链接
        //   urls: [] // 需要预览的图片http链接列表
        // }),
        new AV.File('file-name', {
          blob: {
            uri: tempFilePath,
          },
        }).save().then(
          file => console.log(file.url())
          ).catch(console.error);
      }
    })

  },

  //点击星
  selectBtn: function (e) {
    var rank = e.currentTarget.dataset.key
    this.setData({
      rank: rank
    })
  },
  formSubmit: function (e) {
    var that = this
    if (that.data.rank == undefined) {
      wx.showToast({
        title: '评分不能为空',
        image: '../../images/failure.png',
        duration: 2000
      })
      return false;
    }
    //获得表单数据
    var formData = e.detail.value;
    if (formData.content == '') {
      wx.showToast({
        title: '内容不能为空',
        image: '../../images/failure.png',
        duration: 2000
      })
      return false;
    }

    var postdata = {
      gid: that.data.goods_id,
      oid: that.data.order_id,
      content: formData.content,
      rank: that.data.rank
    }
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/order/appraise/add"),
      method: "POST",
      data: postdata,
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          commentList: res.data.data
        })
        if (res.data.code == 0) {
          wx.showToast({
            title: "评论成功",
            duration: 2000
          })
          wx.request({
            url: app.apiUrl("user/order/appraise"),
            method: "POST",
            header: {
              'Content-Type': 'application/json',
              'X-ECTouch-Authorization': token
            },
            success: function (res) {
              that.setData({
                commentList: res.data.data
              })
            }
          })
          wx.navigateTo({
            url: "../order/index?id=" + 3
          })
        }
      }
    })
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    that.onLoad()

  },
  commentBtn: function () {
    wx.navigateTo({
      url: '../order/comment_detail'
    })
  },



})




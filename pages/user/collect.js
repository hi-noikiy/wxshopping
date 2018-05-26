var app = getApp()
var token
Page({
  data: {
    list: [],
    delBtnWidth: 180,//删除按钮宽度单位（rpx）
  },
  getCartGoods: function (that) {
    var token = wx.getStorageSync('token')
    //调用应用实例的方法获取全局数据
    wx.request({
      url: app.apiUrl("user/collectgoods"),
      method: "POST",
      data: {
        page: 1,
        size: 10
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        that.setData({
          list: res.data.data
        })


      }
    })
  },
  onLoad: function () {
    var that = this
    that.getCartGoods(that);
    that.initEleWidth();

    //加载中
    that.loadingChange();
  },
  loadingChange() {
    setTimeout(() => {
      this.setData({
        hidden: true
      })
    }, 1000)
  },
  /*收藏*/
  delCollect: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.list[index].goods_id;
    var token = wx.getStorageSync('token')
    wx.request({
      url: app.apiUrl("user/collect/add"),
      data: {
        "id": goodsId,
      },
      method: "post",
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        var result = res.data.data;
        if (result == 1) {
          wx.showToast({
            title: '收藏已取消',
            icon: 'warn',
            duration: 200
          })
        }
        that.getCartGoods(that);
      }
    })
  },
  //获取点击的id值
  siteDetail: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var goodsId = that.data.list[index].goods_id;
    wx.navigateTo({
      url: "../goods/index?objectId=" + goodsId
    });
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    var that = this
    this.getCartGoods(that);
    wx.stopPullDownRefresh()
    that.onLoad()

  },
  touchS: function (e) {
    // console.log(e.touches[0].clientX)
    if (e.touches.length == 1) {
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function (e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      // console.log(index)
      var list = this.data.list;
      console.log(list)
      list[index].txtStyle = txtStyle;
      console.log(list[index].txtStyle)
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },

  touchE: function (e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = e.target.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  //获取元素自适应后的实际宽度
  getEleWidth: function (w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth;
      var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应
      // console.log(scale);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  initEleWidth: function () {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },

})
var app = getApp()
var token;
var team_id;
var user_id;
Page({
  onShow: function () {
    var that = this
    var token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: "../login/index"
      });
    }
  },
  onLoad: function (options) {
    var that = this
    token = wx.getStorageSync('token')
    team_id = options.objectId;
    user_id = options.user_id;
    wx.request({
      url: app.apiUrl("team/teamWait"),
      method: "POST",
      data: {
        team_id: team_id,
        user_id: user_id
      },
      header: {
        'Content-Type': 'application/json',
        'X-ECTouch-Authorization': token
      },
      success: function (res) {
        if (res.data.data.team_info.status == '1') {
          wx.setNavigationBarTitle({
            title: '拼团完成',
          })
        }
        that.setData({
          wait: res.data.data,
          user_picture: res.data.data.teamUser
        })
        wx.request({
          url: app.apiUrl('team/teamRanking'),
          data: {
            size: 30,
            page: 1,
            type: 3
          },
          header: {
            'Content-Type': 'application/json',
            'X-ECTouch-Authorization': token
          },
          method: "POST",
          success: function (res) {
            that.setData({
              orders: res.data.data,
            })
          }
        })
        //倒计时
        var endTime = res.data.data.team_info.end_time
        var totalSecond = endTime - Date.parse(new Date()) / 1000;
        var interval = setInterval(function () {
          // 秒数  
          var second = totalSecond;
          // 天数位  
          var day = Math.floor(second / 3600 / 24);
          var dayStr = day.toString();
          if (dayStr.length == 1) dayStr = '0' + dayStr;

          // 小时位  
          var hr = Math.floor((second - day * 3600 * 24) / 3600);
          var hrStr = hr.toString();
          if (hrStr.length == 1) hrStr = '0' + hrStr;

          // 分钟位  
          var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
          var minStr = min.toString();
          if (minStr.length == 1) minStr = '0' + minStr;

          // 秒位  
          var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
          var secStr = sec.toString();
          if (secStr.length == 1) secStr = '0' + secStr;

          that.setData({
            countDownDay: dayStr,
            countDownHour: hrStr,
            countDownMinute: minStr,
            countDownSecond: secStr,
          });
          totalSecond--;
          if (totalSecond < 0) {
            clearInterval(interval);
            wx.showToast({
              title: '活动已结束',
            });
            that.setData({
              countDownDay: '00',
              countDownHour: '00',
              countDownMinute: '00',
              countDownSecond: '00',
            });
          }
        }.bind(this), 1000);
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
  //更多玩法
  groupPlay: function () {
    var that = this;
    that.setData({
      showViewPlay: !that.data.showViewPlay,
      showViewMol: !that.data.showViewMol
    })
  },
  //分享去参团
  addgroupProperty: function () {
    var that = this
    var goodsId = that.data.wait.team_info.goods_id
    var team_id = that.data.wait.team_info.team_id
    wx.navigateTo({
      url: "../group/goods?objectId=" + goodsId + "&team_id=" + team_id,
    });
  },
  //获取点击的id值
  siteDetail: function () {
    var that = this
    var goodsId = that.data.wait.team_info.goods_id;
    wx.navigateTo({
      url: "../group/goods?objectId=" + goodsId
    });
  },
  //更多拼团
  groupMore: function () {
    wx.navigateTo({
      url: "../group/rank"
    });
  },
  userList: function () {
    var that = this
    wx.navigateTo({
      url: "../group/user/list?objectId=" + that.data.wait.team_info.team_id
    });
  },
  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    var that = this
    wx.stopPullDownRefresh()
    that.onLoad()
  },
  //分享
  onShareAppMessage: function () {
    var that = this
    var user_name = that.data.wait.team_info.user_name
    return {
      title: user_name + '邀请您帮忙拼团[等待成团]',
      desc: '您的朋友正在拼团,时间有限，赶快去参与吧！',
      path: '/pages/group/wait?objectId=' + team_id + "&user_id=" + user_id,
    }
  },
})
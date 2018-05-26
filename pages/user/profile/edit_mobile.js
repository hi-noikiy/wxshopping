var app = getApp();
Page({
  data: {
  },
  onLoad: function () {
    var that = this
  },
  /** 
 * 获取短信验证码 
 */
  sendmessg: function (e) {
    if (timer == 1) {
      timer = 0
      var that = this
      var time = 60
      that.setData({
        sendmsg: "sendmsgafter",
      })
      var inter = setInterval(function () {
        that.setData({
          getmsg: time + "s后重新发送",
        })
        time--
        if (time < 0) {
          timer = 1
          clearInterval(inter)
          that.setData({
            sendmsg: "sendmsg",
            getmsg: "获取短信验证码",
          })
        }
      }, 1000)
    } 
    },
  //提交信息
  formSubmit: function (e) {
    //获得表单数据
    var objData = e.detail.value;
  }

})  
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
//首页导航
function getIndexNav(callBack) {
  var str = [
    {
      icon: "../../images/01.gif",
      name: "砍价商城",
      link: "../bargain/index"
    },
    {
      icon: "../../images/02.gif",
      name: "拼团频道",
      link: "../group/index"
    },
    {
      icon: "../../images/04.gif",
      name: "店铺街",
      link: "../store/list"
    }
  ];
  callBack(str);
}
module.exports.getIndexNav = getIndexNav;
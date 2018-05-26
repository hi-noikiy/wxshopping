//index.js
//获取应用实例
var app = getApp()
var search_content = '';
Page({
  data: {
    searchSize: '18',
    searchColor: 'rgba(180,180,180,1)',
    hotrecent: []
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight- 40
        });
      }
    });

  },
  onShow: function () {
    // search_content = '';
    this.getRecentSearch();
  },
  //更新最近搜索
  getRecentSearch: function () {
    var recent = wx.getStorageSync('recentKeyword');

    var recent_arr = recent.split(',');
    var recent_search = [];
    var is_distinct;
    for (var i = 0; i < recent_arr.length; i++) {
      if (recent_arr[i] != '') {
        is_distinct = false;
        for (var j = 0; j < recent_search.length; j++) {
          if (recent_arr[i] == recent_search[j]) {
            is_distinct = true;
          }
        }
        if (is_distinct == false) {
          recent_search.push(recent_arr[i]);
        }
      }
    }

    wx.setStorageSync('recentKeyword', recent_search.join(','))
    this.setData({
      hotrecent: recent_search
    })
  },

  //下拉刷新完后关闭
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
  getSearchContent: function (e) {
    search_content = e.detail.value
  },
  search: function () {
    //搜索

    var recent = wx.getStorageSync('recentKeyword');
    if (recent == '') {
      recent = search_content
    } else {
      recent = recent + ',' + search_content
    }

    wx.setStorageSync('recentKeyword', recent)

    app.redirectTo('../category/product_list?content=' + search_content)
  },
  gosearch: function (e) {
    app.redirectTo('../category/product_list?content=' + e.target.dataset.text)
  },
  clearSearch: function () {
    wx.clearStorageSync()
    this.getRecentSearch()
  },
  closeSearch: function () {
    wx.navigateBack({
      delta: 1
    })
  }
})

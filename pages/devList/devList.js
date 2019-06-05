// pages/index3/index3.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    devList: [],
    typeList: ['success', 'success_no_circle', 'info', 'warn', 'waiting', 'cancel', 'download', 'search', 'clear']

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("gogo")
    var that = this
    wx.request({
      url: 'http://111.231.244.208:8081/devStatus',
      data: {
        username: that.data.userName,
        password: that.data.userPW
      },
      method: 'GET',
      success: function(res) {
        //console.log(res)
        if (res.data.code == 0) {
          var bufList = that.data.bufList
        }
        that.setData({
          devList: res.data.res
        })
      }
    })
  },

  devChecked: function(items) {
    console.log("asdf=", items.target.dataset.info)
    var that = this
    wx.navigateTo({
      //目的页面地址
      url: '../../pages/tempShow/tempShow?imei=' + items.target.dataset.info.imei,
      success: function(res) {
        console.log("跳转啦!")
      },
      fail: (err) => {
        console.error(err)
      }
    })
  }
})
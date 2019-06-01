// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '726iot', //726iot
    userPW:'123456'  //123456
  },
  login: function () {
    var that = this
    wx.request({
      url: 'http://111.231.244.208:8081/login',
      data:{
        username:that.data.userName,
        password:that.data.userPW
      },
      method:'POST',
      dataType:'json',
      success:function(res){
        if(res.data.code == 0)console.log("登录成功！")
        else console.log("登录错误！")
      }
    })
  },
  userNameInput:function(e){
    this.setData({
      userName: e.detail.value
    })
    //console.log(e,e.detail.value)
  },
  userPWInput: function (e) {
    this.setData({
      userPW: e.detail.value
    })
  },
})
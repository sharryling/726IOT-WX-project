// pages/login/login.js
Page({


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
        if(res.data.code == 0){
          wx.navigateTo({
            //目的页面地址
            url: '../../pages/devList/devList',
            success: function (res) {
              //console.log("跳转啦!")
            },
            fail: (err) => {
              console.error(err)
            }
          })
        }
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
//index.js
//获取应用实例


Page({
  data: {
    openid: '',
    input_value:'',
    get_user:true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '立等翻译官'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
  },
  //获取用户头像
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res.userInfo)
        getApp().globalData.userInfo = res.userInfo
        wx.request({
          url: 'https://www.uear.net/ajax2/wx_information.php',
          data: {
            openid: that.data.openid,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            gender: res.userInfo.gender,

          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
          }
        })
        that.setData({
          get_user: false
        })
      }
    })
  },
  input:function(e){
    this.setData({ input_value: e.detail.value });
  },
  sub:function(){
    if (!this.data.input_value==''){
      wx.request({
        //判断
        url: 'https://www.uear.net/ajax2/register.php',
        data: {
          openid: this.data.openid,
          wxid: this.data.input_value
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code==1){
            wx.redirectTo({
              url: '/pages/release/release',
            })
          }
        }
      })
    }
  },
  xieyi:function(){
    wx.navigateTo({
      url: '/pages/xieyi/xieyi',
    })
  }
  
})

//app.js
var uitl = require('/utils/util.js')
App({
  onLaunch: function () {
      // const updateManager = wx.getUpdateManager()
      // updateManager.onCheckForUpdate(function (res) {
      //   // 请求完新版本信息的回调
      //   //console.log(res.hasUpdate)
      //   if (res.hasUpdate){
      //     updateManager.onUpdateReady(function () {
      //       updateManager.applyUpdate()
      //       // wx.showModal({
      //       //   title: '更新提示',
      //       //   content: '新版本已经准备好，是否重启应用？',
      //       //   success: function (res) {

      //       //     // if (res.confirm) {
      //       //     //   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      //       //     // }
      //       //   }
      //       // })
      //     })
      //     updateManager.onUpdateFailed(function () {
      //       // 新的版本下载失败
      //       wx.showModal({
      //         title: '已经有新版本了哟~',
      //         content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      //       })
      //     })
      //   }
      // })
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
       
    //     wx.request({
    //       //获取openid接口
    //       url: 'https://www.uear.net/ajax2/getopenid.php',
    //       data: {
    //         code: res.code
    //       },
    //       method: 'GET',
    //       success: function (res) {
    //         //console.log(res)
    //         var openid = res.data.openid
    //         //console.log(openid)
    //         wx.setStorageSync('openid', openid)
            
    //       },
    //     })
    //   }
    // })
    this.getToken()
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //console.log(res.userInfo)
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getToken() {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (res.code) {
            //发送res.code 到后台
            wx.request({
              //获取openid接口
              url: 'https://www.uear.net/ajax2/getopenid.php',
              data: {
                code: res.code
              },
              method: 'GET',
              success: function (res) {
                //console.log(res)
                var openid = res.data.openid
                wx.setStorageSync('openid', res.data.openid)
                resolve('成功')
              },
              fail() {
                reject('失败');
              }
            })
          }
        }
      })
    })
  },
  globalData: {
    userInfo: {},
    url:''
  }
})
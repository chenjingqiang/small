//app.js

App({
  onLaunch: function () {
    
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          updateManager.applyUpdate()
          // if (res.confirm) {
          //   // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          // }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          //获取openid接口
          url: 'https://www.uear.net/ajax2/getopenid.php',
          data: {
            appid: 'wxa0c99f53f5c5541d',
            secret: '88b5c4163597edb6e898a2e4cc587d1c',
            code: res.code
          },
          method: 'GET',
          success: function (res) {
            var openid = res.data.openid
            //console.log(openid)
            wx.setStorageSync('openid', openid)
          },
        })
      }
    })
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
              var openid = wx.getStorageSync('openid') || ''
              wx.request({
                //判断
                url: 'https://www.uear.net/ajax2/check_user.php',
                data: {
                  openid: openid
                },
                method: 'GET',
                success: function (res) {
                  //console.log(res)
                  // if (res.data.code == 1) {
                  //   wx.redirectTo({
                  //     url: '/pages/index/index',
                  //   })
                  // } else {
                  //   wx.redirectTo({
                  //     url: '/pages/release/release',
                  //   })
                  // }
                },
              })
            }
          })
        }else{
          var openid = wx.getStorageSync('openid') || ''
          wx.request({
            //判断
            url: 'https://www.uear.net/ajax2/check_user.php',
            data: {
              openid: openid
            },
            method: 'GET',
            success: function (res) {
              //console.log(res)
              // if (res.data.code == 1) {
              //   wx.redirectTo({
              //     url: '/pages/index/index',
              //   })
              // } else {
              //   wx.redirectTo({
              //     url: '/pages/release/release',
              //   })
              // }
            },
          })
        }
      }
    })
    
    
  },
  globalData: {
    userInfo: {}
  }
})
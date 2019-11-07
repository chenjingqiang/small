// pages/fly/fly.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan2.png', '../image/map.png'],
    yinying:true,
    t_f:true,
    kefu:'',
    openid: '',
    roomNo: '',
    userID: '',
    tapTime: '',
    template: 'bigsmall',
    tapTime:'',
    get_user:true
  },
  // 绑定输房间号入框
  bindRoomNo: function (e) {
    var self = this;
    self.setData({
      roomNo: e.detail.value
    });
  },
  // 进入rtcroom页面
  joinRoom: function () {
    var self = this;
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      console.log(1)
      return;
    }

    if (!self.data.roomNo) {
      wx.showToast({
        title: '请输入房间号',
        icon: 'none',
        duration: 2000
      })
      return
    }

    if (/^\d\d+$/.test(self.data.roomNo) === false) {
      wx.showToast({
        title: '只能为数字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: '' + util.ajaxurl + 'get_room.php',
      method: 'GET', //请求方式
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        openid: self.data.openid,  //参数
        room: self.data.roomNo
      },
      success: function (res) {
        if(res.data.code==1){
          self.data.userID = self.data.openid
          wx.request({
            url: '' + util.ajaxurl + 'demo1.php',
            method: 'GET', //请求方式
            header: {
              'Content-Type': 'application/json',
            },
            data: {
              userid: self.data.openid,  //参数
            },
            success: function (res) {
              //console.log(res.data)
              self.data.userSig = res.data.data
              //console.log(self.data.userSig)
              var url = `../webrtc-room/room/room?roomID=${self.data.roomNo}&template=${self.data.template}&sdkAppID=1400255908&userId=${self.data.userID}&userSig=${self.data.userSig}`;
              wx.navigateTo({
                url: url
              });

              wx.showToast({
                title: '进入房间',
                icon: 'success',
                duration: 1000
              })

              self.setData({
                'tapTime': nowTime
              });
            },
          })
        }else{
          wx.showToast({
            title: ''+res.data.message+'',
            icon:'none'
          })
        }
        
      }
    })
    


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    that.setData({
      openid: openid,
      latitude: latitude,
      longitude: longitude
    })
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        get_user: false
      })
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        this.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    that.setData({
      yinying: true,
      t_f: true,
    })
    util.get_title(this)
    util.get_red(this)
    wx.request({
      url: '' + util.ajaxurl + 'service_phone.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          kefu: res.data.data
        })
      },complete:function(){
        wx.hideLoading()
      }
    })
  },
  go_kouyi:function(){
    wx.navigateTo({
      url: '/pages/release_kouyi/release_kouyi',
    })
  },
  open_tanchuang:function(){
    this.setData({
      yinying: false,
      t_f: false
    })
  },
  close_tanchuang: function () {
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  //复制
  copyBtn: function (e) {
    var that = this;
    wx.setClipboardData({
      //准备复制的数据
      data: that.data.kefu,
      success: function (res) {
        
      }
    });
  },

  //底部导航
  fabu: function () {
    wx.redirectTo({
      //url: '/pages/rob/rob',
      url: '/pages/release/release',
    })
  },
  liulan: function () {
    wx.redirectTo({
      url: '/pages/liulan/liulan',
    })
  },
  map: function () {
    var that = this
    wx.getSetting({
      success(res) {// 查看所有权限
        //console.log(res)
        let status = res.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
        if (!status || that.data.longitude == '') {// 如果是首次授权(undefined)或者之前拒绝授权(false)
          wx.openSetting({
            success(data) {
              if (data.authSetting["scope.userLocation"] == true) {
                wx.getLocation({ // 请求位置信息
                  type: 'gcj02',
                  success(res) {
                    //console.log(res);
                    that.setData({
                      latitude: res.latitude,
                      longitude: res.longitude
                    })
                    wx.setStorageSync('latitude', res.latitude)
                    wx.setStorageSync('longitude', res.longitude)
                  }
                })
              }
            }
          })
        } else {
          wx.request({
            url: '' + util.ajaxurl + 'translator_status1.php',
            data: {
              openid: that.data.openid
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 0) {
                if (that.data.longitude == '' || that.data.latitude == '') {
                  wx.showToast({
                    title: '请开启手机定位',
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  var data = {
                    openid: that.data.openid,
                    flower_imgs: 0,
                    longitude: that.data.longitude,
                    latitude: that.data.latitude,
                    mark: 1
                  }
                  wx.request({
                    url: '' + util.ajaxurl + 'translator_flower_submit.php',
                    data: data,
                    method: 'GET',
                    success: function (res) {
                    },
                  })
                }
              }
            },
            complete: function () {
              wx.redirectTo({
                url: '/pages/map/map',
              })
            }
          })
        }
      }
    })
  },
  fly: function () {
    wx.redirectTo({
      url: '/pages/fly/fly',
    })
  },
  xuqiu: function () {
    wx.redirectTo({
      url: '/pages/xuqiu/xuqiu',
    })
  },
  wode: function () {
    wx.redirectTo({
      url: '/pages/wode/wode',
    })
  },
  go_become: function () {
    wx.navigateTo({
      url: '/pages/become/become',
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  }
})
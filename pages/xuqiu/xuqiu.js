// pages/xuqiu/xuqiu.js
var app = getApp();
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    latitude:'',
    longitude:'',
    userInfo: {},
    get_user: true,
    bar: ['../image/fabu2.png', '../image/dingdan.png', '../image/wode2.png', '../image/liulan2.png', '../image/map2.png'],
    new_title:'',
    new_status: '',
    new_href: '',
    select:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '查需求'
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
    wx.request({
      url: '' + util.ajaxurl + 'admin_notice.php',
      data: {
        page:1,
      },
      method: 'GET',
      success: function (res) {
        var data=res.data.data
        //console.log(data)
        that.setData({
          new_status:data.status,
          new_title:data.title,
          new_href: data.new_url,
          select:data.lists
        })
      },
      complete:function(){
        wx.hideLoading()
      }
    })
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
    util.get_title(this)
    util.get_red(this)
  },
  go_new:function(e){
    var index = e.currentTarget.dataset.index
    var select=this.data.select
    if (select[index].status==1){
      var wenzhang_src = select[index].new_url
        wx.setStorageSync('wenzhang_src', wenzhang_src)
          wx.navigateTo({
            url: '/pages/wenzhang/wenzhang',
          })
    }
  },
  go_new2:function(){
    if (this.data.new_status == 1) {
      wx.setStorageSync('wenzhang_src', this.data.new_href)
      wx.navigateTo({
        url: '/pages/wenzhang/wenzhang',
      })
    }
    
  },
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res.userInfo)
        getApp().globalData.userInfo = res.userInfo
        that.setData({
          get_user: false,
          userInfo: res.userInfo
        })
      }
    })
  },


  //底部导航
  fabu: function () {
    wx.redirectTo({
      url: '/pages/rob/rob',
      //url: '/pages/release/release',

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
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var page=that.data.page+1
    that.setData({
      page: page
    })
    wx.request({
      url: '' + util.ajaxurl + 'admin_notice.php',
      data: {
        page: page,
      },
      method: 'GET',
      success: function (res) {
        var data = res.data.data
        if (data.lists==''){
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }else{
          that.setData({
            new_status: data.status,
            new_title: data.title,
            new_href: data.new_url,
            select: that.data.select.concat(data.lists)
          })
        }
      },
      complete: function () {
        wx.hideLoading()
      }
    })
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
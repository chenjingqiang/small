// pages/start/start.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    if (openid==''){
      app.getToken().then((resArg) => {
        if (options.wenzhang_src) {
          //分享文章
          wx.setStorageSync('wenzhang_src', options.wenzhang_src)
          wx.setStorageSync('share_wenzhang', true) //为了区分返回
          wx.navigateTo({
            url: '/pages/wenzhang/wenzhang',
          })
        } else if (options.detil_id) {
          //分享翻译官
          wx.setStorageSync('detil_id', options.detil_id)
          wx.setStorageSync('share_detil', true)
          wx.navigateTo({
            url: '/pages/detil/detil',
          })
        } else if (options.rob_oid) {
          //分享订单
          wx.setStorageSync('rob_oid', options.rob_oid)
          wx.setStorageSync('share_rob_detil_id', true)
          wx.navigateTo({
            url: '/pages/rob_detil/rob_detil',
          })
        } else if (options.cid) {
          //分享契约
          wx.setStorageSync('cid', options.cid)
          wx.setStorageSync('share_cid', true)
          wx.navigateTo({
            url: '/pages/qiyue/qiyue',
          })
        } else {
          //无分享 去首页
          wx.redirectTo({
            url: '/pages/fly/fly',
          })
        }
      })
    }else{
      if (options.wenzhang_src) {
        //分享文章
        wx.setStorageSync('wenzhang_src', options.wenzhang_src)
        wx.setStorageSync('share_wenzhang', true) //为了区分返回
        wx.navigateTo({
          url: '/pages/wenzhang/wenzhang',
        })
      } else if (options.detil_id) {
        //分享翻译官
        wx.setStorageSync('detil_id', options.detil_id)
        wx.setStorageSync('share_detil', true)
        wx.navigateTo({
          url: '/pages/detil/detil',
        })
      } else if (options.rob_oid) {
        //分享订单
        wx.setStorageSync('rob_oid', options.rob_oid)
        wx.setStorageSync('share_rob_detil_id', true)
        wx.navigateTo({
          url: '/pages/rob_detil/rob_detil',
        })
      } else if (options.cid) {
        //分享契约
        wx.setStorageSync('cid', options.cid)
        wx.setStorageSync('share_cid', true)
        wx.navigateTo({
          url: '/pages/qiyue/qiyue',
        })
      } else {
        //无分享 去首页
        wx.redirectTo({
          url: '/pages/fly/fly',
        })
      }
    }
    
  },
  onShow: function () {
    
    
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

  }
})
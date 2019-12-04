// pages/vip/vip.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    yinying: false,
    money_box: false,
    money:0,
    code:10,
    message:'',
    charge_money:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    that.setData({
      openid: openid,
      latitude: latitude,
      longitude: longitude
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
    var that = this
    util.get_title(this)
    that.setData({
      yinying: false,
      money_box: false
    })
    wx.request({
      url: '' + util.ajaxurl + 'member_status.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          code: res.data.code
        })
        if (res.data.code==1){
          that.setData({
            charge_money:res.data.data.charge_money
          })
        }
        if (res.data.code == 2) {
          that.setData({
            message: res.data.data.liyou
          })
        }
      }
    })
  },
  money:function(e){
    //console.log(e.detail.value)
    this.setData({
      money:e.detail.value
    })
  },
  sub:function(){
    var that=this
    if (that.data.code==1){
      wx.request({
        //判断
        url: '' + util.ajaxurl + 'update_c_m.php',
        data: {
          openid: this.data.openid,
          charge_money: this.data.money
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          that.onShow()
        }
      })
    }else{
      wx.request({
        //判断
        url: '' + util.ajaxurl + 'translator_member.php',
        data: {
          openid: this.data.openid,
          charge_money: this.data.money
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          wx.showToast({
            title: res.data.message,
            icon:'none'
          })
          that.onShow()
        }
      })
    }
  },
  but:function(){
    //console.log(this.data.money)
    this.setData({
      yinying: true,
      money_box: true
    })
  },
  quxiao: function () {
    this.setData({
      yinying: false,
      money_box: false,
      money:0
    })
  },
  close:function(){
    this.setData({
      yinying: false,
      success: false,
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
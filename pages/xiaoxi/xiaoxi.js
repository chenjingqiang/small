// pages/xiaoxi/xiaoxi.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    page:1,
    select:[],
    tit:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var openid = wx.getStorageSync('openid') || ''
    that.setData({
      openid: openid
    })
    wx.request({
      //判断
      url: '' + util.ajaxurl + 'my_notices.php',
      data: {
        openid: that.data.openid,
        page:1
      },
      method: 'GET',
      success: function (res) {
        var data=res.data.data
        console.log(data)
        that.setData({
          select:data
        })
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
  },
  go_xiangqing:function(e){
    var type=e.currentTarget.dataset.type
    var type_id = e.currentTarget.dataset.type_id
    if(type==3){
      wx.setStorageSync('detil_id', type_id)
      wx.navigateTo({
        url: '/pages/detil/detil',
      })
    }else{
      wx.setStorageSync('rob_oid', type_id)
      wx.navigateTo({
        url: '/pages/rob_detil/rob_detil',
      })
    }

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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    var page = that.data.page + 1
    that.setData({
      page: page
    })
    wx.request({
      url: '' + util.ajaxurl + '/my_notices.php',
      data: {
        openid: this.data.openid,
        page: that.data.page
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.data == '') {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        } else {
          that.setData({
            select: that.data.select.concat(res.data.data)
          })
        }
        wx.hideLoading()
      },
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
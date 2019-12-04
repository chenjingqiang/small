// pages/tixian/tixian.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    data:'',
    money:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid,
      money:''
    })
    
    wx.request({
      //判断
      url: '' + util.ajaxurl + 'show_money.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          data: res.data.data
        })
        
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
  get_money:function(e){
    this.setData({
      money: e.detail.value
    })
  },
  quanbu:function(){
    this.setData({
      money: this.data.data.sure_money
    })
  },
  sub:function(){
    var that = this
    // 防止两次点击操作间隔太快
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 1000) {
      return;
    }
    var reg = /\s/;
    if (reg.test(this.data.money) || !this.data.money){
      wx.showToast({
        title: '请填写提现金额',
        icon: 'none'
      })
      return;
    }
    
    wx.request({
      //判断
      url: '' + util.ajaxurl + 'withdrawal.php',
      data: {
        openid: this.data.openid,
        money:that.data.money
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          title: res.data.message,
          icon:'none'
        })
        if (res.data.code==1){
          that.onLoad()
        }

      }
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
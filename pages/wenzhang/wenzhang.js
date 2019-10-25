// pages/wenzhang/wenzhang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wenzhang_src:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var wenzhang_src = wx.getStorageSync('wenzhang_src')||''
    this.setData({
      wenzhang_src: wenzhang_src
    })
    //console.log(wenzhang_src)
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
    var share_wenzhang = wx.getStorageSync('share_wenzhang') || ''
    if (share_wenzhang) {
      wx.setStorageSync('share_wenzhang', false)
      wx.reLaunch({
        url: '/pages/xuqiu/xuqiu',
      })
    } 
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
    var wenzhang_src = wx.getStorageSync('wenzhang_src') || '';
    return {

      title: this.data.tit,

      desc: '分享页面的内容',

      path: '/pages/start/start?wenzhang_src=' + wenzhang_src

    }
  }
})
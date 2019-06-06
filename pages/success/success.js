// pages/success/success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid:'',
    weixin:'',
    money:'',
    fencheng:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '翻译官已接单'
    })
    var oid = wx.getStorageSync('oid') || ''
    this.setData({
      oid: oid
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
    var that=this
    //获取用户微信号
    wx.request({
      url: 'https://www.uear.net/ajax2/show_wxid.php',
      data: {
        oid: that.data.oid,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          weixin: res.data.data.wxid,
          money: res.data.data.money,
          fencheng: res.data.data.fencheng
        })
      },
    })
  },
  fuzhi: function (){
    var that=this
    wx.setClipboardData({
      data: this.data.weixin,
      success: function (res) {
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

  }
})
// pages/zizhi/zizhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mas: ['https://www.uear.net/img/yyzz.jpg','https://www.uear.net/img/ruanzhu.jpg']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示0
   */
  onShow: function () {

  },
  load:function(e){
    if (e.currentTarget.dataset.index == this.data.mas.length-1){
      wx.hideLoading()
    }
  },
  handleImagePreview(e) {
   var that=this
    wx.previewImage({
      current: that.data.mas[e.currentTarget.dataset.index],  //当前预览的图片
      urls: that.data.mas,  //所有要预览的图片
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
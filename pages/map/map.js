// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:0,
    longitude:0,
    markers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        console.log(res)
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          markers: [{
            id: "1",
            latitude: res.latitude,
            longitude: res.longitude,
            iconPath: '../image/chenggong.jpg',
            width: 30,
            height: 30,
            // callout: {
            //   content: "语言：英文和中文",
            //    fontSize: "16",
            //   borderRadius: "10",
            //    bgColor: "#ffffff",
            //    padding: "10",
            //    display: "ALWAYS"
            // }
          }],
        })
      },
    })
  },
  markersAction:function(e){
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
    //console.log(e.markerId)
    var markerId = e.markerId
    var markers=this.data.markers
    for(var i=0;i<markers.length;i++){
      if (markerId == markers[i].id){
        console.log(markers[i].latitude)
        console.log(markers[i].longitude)
      }
    }
  },
  //结束
  jieshu:function(){
    //wx.hideLoading()
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
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })

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
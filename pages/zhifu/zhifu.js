// pages/zhifu/zhifu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtOrderCode: '',
    openid:'',
   



  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  pay: function () {
    wx.request({
      url: 'https://www.uear.net/ajax2/pay.php',
      data: {
        openid:this.data.openid,
        total_fee:100
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        var data=res.data.data
        wx.requestPayment({
          timeStamp: data.timeStamp+'',//时间戳
          nonceStr: data.nonceStr, //随机字符串长度
          package: data.package,  //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
          signType: 'MD5', //签名算法
          paySign: data.paySign,     //签名
          success(res) {
            //console.log(res)
          },
          fail(res) { }
        })

      }
    })
   
    
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
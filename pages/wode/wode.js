// pages/wode/wode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    tit:'',
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode.png', '../image/liulan2.png'],
    code:0,
    wx_img: '../image/logo.png',
    wx_name:'立等翻译官',
    message:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid=wx.getStorageSync('openid')
    this.setData({
      openid:openid
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
    //翻译官认证状态
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax4/translator_status.php',
      data: {
        openid:this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code==1){
          that.setData({
            code: res.data.code,
            wx_img: res.data.data.wx_img,
            wx_name: res.data.data.wx_name,
          })
        } else if (res.data.code == 2){
          that.setData({
            code: res.data.code,
            wx_img: '../image/logo.png',
            wx_name: '立等翻译官',
            message: res.data.data.reason
          })
        } else if (res.data.code == 3) {
          that.setData({
            code: res.data.code,
            wx_img: res.data.data.wx_img,
            wx_name: res.data.data.wx_name,
          })
        } else if (res.data.code == 0){
          that.setData({
            code: 0,
            wx_img: '../image/logo.png',
            wx_name: '立等翻译官',
          })
        }
        
      }
    })
    //获取分享标题
    wx.request({
      url: 'https://www.uear.net/ajax2/random_text.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          tit: res.data.data
        })
      }
    })
  },
  //底部导航
  go_qianbao: function () {
    wx.navigateTo({
      url: '/pages/qianbao/qianbao',
    })
  },
  go_yijian: function () {
    wx.navigateTo({
      url: '/pages/yijian/yijian',
    })
  },
  go_xiugai: function () {
    wx.navigateTo({
      url: '/pages/change_wx/change_wx',
    })
  },
  fabu: function() {
    wx.redirectTo({
      url: '/pages/rob/rob',
    })
  },
  liulan: function () {
    wx.redirectTo({
      url: '/pages/liulan/liulan',
    })
  },
  dingdan: function () {
    wx.redirectTo({
      url: '/pages/dingdan/dingdan',
    })
  },
  wode: function () {
    wx.redirectTo({
      url: '/pages/wode/wode',
    })
  },
  go_become:function(){
    wx.navigateTo({
      url: '/pages/become/become',
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})
// pages/detil/detil.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yinying: true,
    t_f: true,
    nan_nv:'',
    name: '',
    age: '',
    add1: '',
    add2: '',
    wxid: '',
    picker_value: '',
    biaoqian_select:[],
    yuyan_arr: [],
    beijing: '',
    jingli: '',
    nianxian: '',
    wx_img: '',
    browse: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that=this
    var detil_id = wx.getStorageSync('detil_id');
    wx.request({
      url: 'https://www.uear.net/ajax4/browse_plus.php',
      data: {
        openid: detil_id,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
      }
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/trandlator_details.php',
      data: {
        openid: detil_id,
      },
      method: 'GET',
      success: function (res) {
        var data=res.data.data
        //console.log(data)
        var yuyan2_arr = data.major_certificate
        var yuyan2=[]
        for (var i = 0; i < yuyan2_arr.length;i++){
          var aaa = yuyan2_arr[i]
          if (i < yuyan2_arr.length-1){
            aaa = yuyan2_arr[i]+'、'
          }
          yuyan2.push(aaa)
        }
        that.setData({
          nan_nv: data.wx_sex,
          name: data.wx_name,
          age: data.wx_age,
          add1: data.country,
          add2: data.city,
          wxid: data.wxid,
          picker_value: data.education,
          yuyan_arr: data.language,
          beijing: data.background,
          jingli: data.work_text,
          nianxian: data.work_years,
          wx_img: data.wx_img,
          browse: data.browse,
          yuyan2_arr: yuyan2,
          names2: data.major_scene,
          source: data.source,
          biaoqian_select: data.major_scene
        })
      }, 
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  ckwxid: function (e) {
    this.setData({
      yinying: false,
      t_f: false,
    })
  },
  change_wxid: function () {
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.wxid,
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
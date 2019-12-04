var app = getApp();
var util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    latitude: '',
    longitude: '',
    get_user: true,
    userInfo: {},
    wode_tf: false,
    textarea_tf: false,
    t_length: 0,
    bar: ['../image/fabu.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan2.png', '../image/map2.png'],
    tit: '',
    dingdan_dian: false,
    yin_box: false,
    luyin_wancheng: false,
    luyin_ing: false,
    luyin_complete: false,
    close_luyin_tf: true,
    miao: 1,
    timer: '',
    tempFilePath: '',
    show_dong: true,
    biaoqian_box: false,
    biaoqian_select: [],
    name: true,
    names2: [],
    array: [],
    arr_index: 0,
    arr_value: '',
    array2: [],
    arr_index2: 0,
    arr_value2: '',
    money: 0,
    zuidi_money: 0,
    animation_sub: '',
    sub_box_text: '',
    text: '',
    left: '',
    value: '',
    value2: '请输入您的项目需求...',
    status_t_f: false,
    get_user: false,
    userInfo: '',
    time_value: '',
    didian_value: '',
    neirong_value: '',
    yaoqiu_value: '',
    phone_value:'',
    day: 0,
    plus_money: 0,
    scroll: 0,
    start_time: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var that = this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    that.setData({
      openid: openid,
      latitude: latitude,
      longitude: longitude
    })
    if (app.globalData.userInfo.nickName) {
      //console.log(app.globalData.userInfo)
      this.setData({
        userInfo: app.globalData.userInfo,
        get_user: false
      })
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        this.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    }

  },
  onShow: function () {
    var that = this
    util.get_title(that)
    that.setData({
      arr_index: 0,
      arr_index2: 0
    })
    //获取最低价格
    wx.request({
      url: '' + util.ajaxurl +'check_order1.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        that.setData({
          zuidi_money: res.data.data
        })
      }
    })
  },
  
  //获取用户头像
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res.userInfo)
        getApp().globalData.userInfo = res.userInfo
        that.setData({
          get_user: false,
          userInfo: res.userInfo
        })
      }
    })
  },
  //获取源语言
  lange1_value: function (e) {
    //console.log(e.detail.value)
    this.setData({
      arr_value: e.detail.value
    })
  },
  //获取目标语言
  lange2_value: function (e) {
    //console.log(e.detail.value)
    this.setData({
      arr_value2: e.detail.value
    })
  },
  //项目时间
  get_time: function (e) {
    var value = e.detail.value;
    this.setData({
      time_value: value
    })
  },
  //微信号
  get_phone: function (e) {
    var phone_value = e.detail.value;
    this.setData({
      phone_value: phone_value
    })
  },
  //专业方式
  get_yaoqiu: function (e) {
    var value = e.detail.value;
    this.setData({
      yaoqiu_value: value
    })
  },
  //项目需求
  inputs: function (e) {
    var value = e.detail.value;
    // 获取输入框内容的长度
    //var len = parseInt(value.length);
    this.setData({
      value: value,
      value2: value
    })
  },
  get_day: function (e) {
    //console.log(e.detail.value)
    var day = Number(e.detail.value)
    var plus_money = Number(this.data.plus_money)
    this.setData({
      day: day,
      money: day + plus_money
    })
  },
  
  //提交确认
  sub: function () {
    var that = this
      wx.setStorageSync('money', that.data.money)
      if (this.data.arr_value == '') {
        wx.showToast({
          title: '源语言不能为空',
          icon: 'none'
        })
        return;
      }
      if (this.data.arr_value2 == '') {
        wx.showToast({
          title: '目标语言不能为空',
          icon: 'none'
        })
        return;
      }
      if (this.data.time_value == '') {
        wx.showToast({
          title: '项目时间不能为空',
          icon: 'none'
        })
        return;
      }
      if (this.data.phone_value == '') {
        wx.showToast({
          title: '微信号不能为空',
          icon: 'none'
        })
        return;
      }
      if (this.data.yaoqiu_value == '') {
        wx.showToast({
          title: '专业要求不能为空',
          icon: 'none'
        })
        return;
      }
      if (this.data.day == 0) {
        wx.showToast({
          title: '请填写费用',
          icon: 'none'
        })
        return;
      }
      var data = {
        openid: that.data.openid,
        language: that.data.arr_value,
        language2: that.data.arr_value2,
        project_time: that.data.time_value,
        project_skill: that.data.yaoqiu_value,
        money: that.data.money,
        text: that.data.value,
        oral_phone: that.data.phone_value
      }
      wx.showLoading({
        title: '下单中',
        mask: true
      })
      wx.request({
        url: '' + util.ajaxurl +'release1_oral.php',
        data: data,
        method: 'GET',
        success: function (res) {
          var release_oid = res.data.data.oid
          wx.setStorageSync('release_oid', release_oid)
          if (res.data.code == 1) {
            wx.navigateTo({
              url: '/pages/pay/pay',
            })
          }else{
            wx.showToast({
              title: '下单失败',
              icon: 'none',
            })
            return;
          }
        },complete:function(){
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


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wxid_true: false
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})
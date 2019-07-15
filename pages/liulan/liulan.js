// pages/liulan/liulan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    get_user: true,
    userInfo: {},
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan.png'],
    select:[],
    time: 0,
    wxid_true:false,
    yinying: true,
    t_f2: true,
    wxid_value:'',
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
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
    that.setData({
      time:0,
      wxid_true: false,
      yinying: true,
      t_f2: true,
      page:1
    })
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax4/translator_list.php',
      data: {
        openid: this.data.openid,
        page:1,
        limit:10
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          select:res.data.data
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    //获取用户是否填写微信号
    wx.request({
      url: 'https://www.uear.net/ajax4/get_mywxid.php',
      data: {
        openid: this.data.openid,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        that.setData({
          wxid_true: res.data.data
        })
      }
      //请求完成后执行的函数
    })
  },
  //授权
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
  //查看详情
  ckeak_detil:function(e){
    //console.log(this.data.time)
    var that = this
    var detil_id = e.currentTarget.dataset.detil_id
    
    if(this.data.time==0){
      wx.setStorageSync('detil_id', detil_id)
      wx.navigateTo({
        url: '/pages/detil/detil',
      })
      this.setData({
        time: Date.parse(new Date())
      })
    }
    
  },
  //关闭微信号弹窗
  tanchuang_weixin_close: function () {
    this.setData({
      yinying: true,
      t_f2: true
    })
  },
  //获取用户微信id
  get_wxid: function (e) {
    var wxid_value = e.detail.value
    this.setData({
      wxid_value: wxid_value
    })
  },
  //wxid提交
  wxid_sub: function () {
    var that = this
    if (that.data.wxid_value == '') {
      wx.showToast({
        title: '联系方式不能为空',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return
    }
    wx.request({
      url: 'https://www.uear.net/ajax4/change_wxid.php',
      data: {
        openid: this.data.openid,
        wxid: this.data.wxid_value
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '提交成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        } else {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },
  fabu: function () {
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
    if (this.data.wxid_true) {
      wx.redirectTo({
        url: '/pages/dingdan/dingdan',
      })
    } else {
      this.setData({
        yinying: false,
        t_f2: false
      })
    }

  },
  wode: function () {
    if (this.data.wxid_true) {
      wx.redirectTo({
        url: '/pages/wode/wode',
      })
    } else {
      this.setData({
        yinying: false,
        t_f2: false
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
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var page = that.data.page + 1
    that.setData({
      page: page
    })
    wx.request({
      url: 'https://www.uear.net/ajax4/translator_list.php',
      data: {
        openid: that.data.openid,
        page: that.data.page,
        limit: 10
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          select: that.data.select.concat(res.data.data)
        })
        //console.log('成功')
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
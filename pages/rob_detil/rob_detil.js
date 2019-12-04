// pages/rob_detil/rob_detil.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rob_oid:'',
    userInfo:{},
    get_user: true,
    data:{},
    type:0,
    yinying:true,
    t_f: true,
    t_f3: true,
    wei_shuru_tf:false,
    shuru_value:'',
    send:false,
    zan_tf:false,
    page:1,
    select:[],
    tit:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var openid = wx.getStorageSync('openid') || ''
    var rob_oid = wx.getStorageSync('rob_oid') || ''
    this.setData({
      openid: openid,
      rob_oid: rob_oid,
      shuru_value:''
    })
    if (app.globalData.userInfo.nickName) {
      this.setData({
        userInfo: app.globalData.userInfo,
        get_user: false
      })
      
    } else {
      app.userInfoReadyCallback = res => {
        //console.log('userInfoReadyCallback: ', res.userInfo);
        //console.log('获取用户信息成功');
        that.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    }
    //增加浏览量
    wx.request({
      url: '' + util.ajaxurl + 'order_browse.php',
      data: {
        oid: that.data.rob_oid,
      },
      method: 'GET',
      success: function (res) {

      }
    })
    //获取翻译官状态
    wx.request({
      url: '' + util.ajaxurl + 'translator_status.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == 0) {
          that.setData({
            type: false,
          })
        } else {
          that.setData({
            type: true
          })
        }
      },
    })
    //获取详情
    wx.request({
      url: '' + util.ajaxurl + 'order_details.php',
      data: {
        openid: that.data.openid,
        oid: that.data.rob_oid,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          data:res.data.data
        })
        if (res.data.data.like_status==1){
          that.setData({
            zan_tf: true
          })
        }
      },
      
    })
    //评论列表
    wx.request({
      url: '' + util.ajaxurl + 'lists_comment.php',
      data: {
        type: 1,
        type_id: that.data.rob_oid,
        openid1: that.data.openid,
        page: 1,
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          select: res.data.data
        })
      },
      complete: function () {
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
  onShow: function () {
    var that = this
    util.get_title(that)
  },
  //拉起授权
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
  //查看微信号
  ckwxid: function (e) {
    if (this.data.type) {
      this.setData({
        yinying: false,
        t_f: false
      })
    } else {
      this.setData({
        yinying: false,
        t_f3: false
      })
    }

  },
  change_tanchuang3: function () {
    this.setData({
      yinying: true,
      t_f3: true
    })
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.data.or_phone,
      success: function (res) {
      }
    })
  },
  change_wxid: function () {
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  //去认证
  go_renzheng: function () {
    wx.navigateTo({
      url: '/pages/become/become',
    })
  },
  //调起输入框
  change_wei_shuru_tf:function(){
    this.setData({
      wei_shuru_tf:true,
    })
  },
  
  //获取评论
  get_pinglun:function(e){
    this.setData({
      wei_shuru_tf: false,
      shuru_value : e.detail.value
  })
  },
  //发送评论
  send_pinglun: function (e) {
    var that=this
    if (e.detail.value==''){
      return
    }
    wx.request({
      url: '' + util.ajaxurl + 'get_comments.php',
      data: {
        type: 1,
        type_id: that.data.data.oid,
        openid1: that.data.openid,
        content: e.detail.value,
        wx_name: that.data.userInfo.nickName,
        wx_img: that.data.userInfo.avatarUrl,
      },
      method: 'GET',
      success: function (res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.code==1){
          that.onLoad()
        }
      }
    })
    
   

  },
  //点赞
  click_zan:function (){
    var that=this
    if (that.data.zan_tf){
      return
    }
    wx.request({
      url: '' + util.ajaxurl + 'get_likes.php',
      data: {
        type: 1,
        type_id: that.data.data.oid,
        openid1: that.data.openid,
        wx_name: that.data.userInfo.nickName,
        wx_img: that.data.userInfo.avatarUrl,
      },
      method: 'GET',
      success: function (res) {
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.code==1) {
          that.onLoad()
        }


      }
    })
  },
  //删除评论
  shanchu_pinglun:function(e){
    var that=this
    var shanchu_id=e.currentTarget.dataset.shanchu_id
    wx.request({
      url: '' + util.ajaxurl + 'order_de_ct.php',
      data: {
        id: shanchu_id
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.code)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
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
    var share_rob_detil_id = wx.getStorageSync('share_rob_detil_id') || ''
    if (share_rob_detil_id) {
      wx.setStorageSync('share_rob_detil_id', false)
      wx.reLaunch({
        url: '/pages/rob/rob',
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
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that=this
    var page=that.data.page+1
    that.setData({
      page:page
    })
    //评论列表
    wx.request({
      url: '' + util.ajaxurl + 'lists_comment.php',
      data: {
        type: 1,
        type_id: that.data.data.oid,
        openid1: that.data.openid,
        page: page,
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data==''){
          wx.showToast({
            title: '已经到底了',
            icon:'none'
          })
          return
        }
        that.setData({
          select: res.data.data.concat(res.data.data)
        })
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
    var rob_oid = wx.getStorageSync('rob_oid') || '';
    return {

      title: this.data.tit,

      desc: '分享页面的内容',

      path: '/pages/start/start?rob_oid=' + rob_oid

    }
  }
})
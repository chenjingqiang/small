// pages/qiyue_list/qiyue_list.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    act:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    that.setData({
      openid: openid
    })
    that.list(1)
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
    util.get_title(this)
  },
  //加载列表
  list: function (identity_status){
    var that=this
    wx.request({
      url: '' + util.ajaxurl + 'contracts.php',
      data: {
        openid: this.data.openid,
        identity_status: identity_status
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.data==''){
         // console.log('空')
          that.setData({
            select: []
          })
        }else{
          that.setData({
            select: res.data.data
          })
        }
        
      }

    })
  },
  change_act:function(){
    this.setData({
      act:true
    })
    this.list(1)
  },
  change_act2: function () {
    this.setData({
      act: false
    })
    this.list(2)
  },
  //甲方确认完成
  sub : function (e) {
    var that=this
    var index = e.currentTarget.dataset.index
    console.log(index)
    var cid = this.data.select[index].cid
    var status = this.data.select[index].status
    var identity_status = this.data.select[index].identity_status
    wx.request({
      url: '' + util.ajaxurl + 'contracts_complete.php',
      data: {
        cid: cid,
        status: status,
        identity_status: identity_status
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.code==1){
          that.list(1)
        }
      }

    })
  },
  //乙方完成翻译
  sub2: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var cid = this.data.select[index].cid
    var status = this.data.select[index].status
    var identity_status = this.data.select[index].identity_status
    wx.request({
      url: '' + util.ajaxurl + 'contracts_complete.php',
      data: {
        cid: cid,
        status: status,
        identity_status: identity_status
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: res.data.message,
          icon: 'none'
        })
        if (res.data.code == 1) {
          that.list(2)
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
    wx.showToast({
      title: '没有更多数据了',
      icon:'none'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  }
})
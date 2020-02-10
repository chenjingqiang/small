// pages/wode/wode.js
var util = require("../../utils/util.js")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    latitude:'',
    longitude:'',
    tit:'',
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode.png', '../image/liulan2.png', '../image/map2.png'],
    code:0,
    wx_img: '../image/logo.png',
    wx_name:'立等翻译官',
    message:'',
    latitude:'',
    longitude:'',
    member_status:0,
    resume_status:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    that.setData({
      openid: openid,
      latitude: latitude,
      longitude: longitude
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
    util.get_title(this)
    util.get_red(this)
    //翻译官认证状态
    wx.request({
      //判断
      url: '' + util.ajaxurl +'translator_status.php',
      data: {
        openid:this.data.openid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code==1){
          that.setData({
            code: res.data.code,
            wx_img: res.data.data.wx_img,
            wx_name: res.data.data.wx_name,
            member_status: res.data.data.member_status,
            resume_status: res.data.data.resume_status
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
    
  },
  go_vip: function () {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  },
  go_zhuye:function(){
    wx.setStorageSync('detil_id', this.data.openid)
    wx.navigateTo({
      url: '/pages/detil/detil',
    })
  },
  go_xiaoxi: function () {
    wx.navigateTo({
      url: '/pages/xiaoxi/xiaoxi',
    })
  },
  go_qianbao: function () {
    wx.navigateTo({
      url: '/pages/qianbao/qianbao',
    })
  },
  go_jilu: function () {
    wx.navigateTo({
      url: '/pages/dingdan/dingdan',
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
  go_qiyue_list:function(){
    wx.navigateTo({
      url: '/pages/qiyue_list/qiyue_list',
    })
  },
  biaozhun:function(){
    wx.navigateTo({
      url: '/pages/xieyi/xieyi',
    })
  },
  //上传简历
  jianli:function(){
    var that=this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        wx.showLoading({
          title: '上传中',
          mask:true
        })
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths= res.tempFiles[0].path
        //console.log(tempFilePaths)
        var data={
          openid:that.data.openid
        }
        wx.uploadFile({
          url: '' + util.ajaxurl + 'translator_resume.php',
          filePath: tempFilePaths,
          header: {
            'content-type': 'multipart/form-data'
          },
          name: 'file',
          formData: data,
          success: function (res) {
            var data=JSON.parse(res.data)
            wx.hideLoading()
            wx.showToast({
              title: data.message
            })
            that.onShow()
          },
          fail:function(){
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon:'none'
            })
          }
        })
        
      }
    })
  },






  //底部导航
  fabu: function() {
    wx.redirectTo({
      url: '/pages/rob/rob',
      //url: '/pages/release/release',
    })
  },
  liulan: function () {
    wx.redirectTo({
      url: '/pages/liulan/liulan',
    })
  },
  map: function () {
    var that = this
    wx.getSetting({
      success(res) {// 查看所有权限
        //console.log(res)
        let status = res.authSetting['scope.userLocation']// 查看位置权限的状态，此处为初次请求，所以值为undefined
        if (!status || that.data.longitude == '') {// 如果是首次授权(undefined)或者之前拒绝授权(false)
          wx.openSetting({
            success(data) {
              if (data.authSetting["scope.userLocation"] == true) {
                wx.getLocation({ // 请求位置信息
                  type: 'gcj02',
                  success(res) {
                    //console.log(res);
                    that.setData({
                      latitude: res.latitude,
                      longitude: res.longitude
                    })
                    wx.setStorageSync('latitude', res.latitude)
                    wx.setStorageSync('longitude', res.longitude)
                  }
                })
              }
            }
          })
        } else {
          wx.request({
            url: '' + util.ajaxurl +'translator_status1.php',
            data: {
              openid: that.data.openid
            },
            method: 'GET',
            success: function (res) {
              if (res.data.code == 0) {
                if (that.data.longitude == '' || that.data.latitude == '') {
                  wx.showToast({
                    title: '请开启手机定位',
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  var data = {
                    openid: that.data.openid,
                    flower_imgs: 0,
                    longitude: that.data.longitude,
                    latitude: that.data.latitude,
                    mark: 1
                  }
                  wx.request({
                    url: '' + util.ajaxurl +'translator_flower_submit.php',
                    data: data,
                    method: 'GET',
                    success: function (res) {
                    },
                  })
                }
              }
            },
            complete: function () {
              wx.redirectTo({
                url: '/pages/map/map',
              })
            }
          })
        }
      }
    })
  },
  fly: function () {
    wx.redirectTo({
      url: '/pages/fly/fly',
    })
  },
  xuqiu: function () {
    wx.redirectTo({
      url: '/pages/xuqiu/xuqiu',
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
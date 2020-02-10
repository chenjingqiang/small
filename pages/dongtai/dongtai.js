// pages/dongtai/dongtai.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    t_f:false,
    value:'',
    image_arr:[],
    aub_images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.get_title(that)
    var openid = wx.getStorageSync('openid')
    this.setData({
      openid: openid,
      t_f: false,
      value: '',
      image_arr: [],
      aub_images: []
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

  },
  //取消
  quxiao:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  //上传照片
  chooseImage(e) {
    var that = this
    wx.chooseImage({
      count: 9 - that.data.image_arr.length,
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        var image_arr = this.data.image_arr.concat(res.tempFilePaths)
        // 限制最多只能留下9张照片
        image_arr = image_arr.length <= 9 ? image_arr : image_arr.slice(0, 9)
        that.setData({
          image_arr: image_arr
        })
        wx.showLoading({
          title: '等待',
        })
        for (var i = 0; i < image_arr.length; i++) {
          //旧照片不用上传
          if (image_arr[i].indexOf('uear') == -1) {
            wx.uploadFile({
              url: '' + util.ajaxurl + 'translator_upload_photo.php',
              filePath: image_arr[i],
              header: {
                'content-type': 'multipart/form-data'
              },
              name: 'file',
              success: function (res) {
                var data = JSON.parse(res.data)
                var aub_images = that.data.aub_images
                aub_images.push(data.data.photoUrl)
                var arr = aub_images
                var hash = [];
                for (var i = 0; i < arr.length; i++) {
                  if (hash.indexOf(arr[i]) == -1) {
                    hash.push(arr[i]);
                  }
                }
                that.setData({
                  aub_images: hash,
                  t_f:true
                })
              },
              complete: function () {
                wx.hideLoading()
              }
            })
          }
        }
      }
    })
  },
  //删除
  removeImage(e) {
    var idx = e.target.dataset.idx
    var image_arr = this.data.image_arr
    image_arr.splice(idx, 1)
    if (image_arr == ''&&this.data.value=='') {
      var t_f=false
    }else{
      var t_f=true
    }
    this.setData({
      image_arr: image_arr,
      aub_images: image_arr,
      t_f: t_f
    })
   
  },
  //预览
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const image_arr = this.data.image_arr
    wx.previewImage({
      current: image_arr[idx],  //当前预览的图片
      urls: image_arr,  //所有要预览的图片
    })
  },
  get_value:function(e){
    if (e.detail.value == ''&& this.data.aub_images=='') {
      this.setData({
        t_f: false
      })
    } else {
      this.setData({
        t_f: true
      })
    }
    this.setData({
      value: e.detail.value
    })
    
  },
  sub:function(){
    var that=this
    if (that.data.t_f){
      wx.showLoading({
        title: '上传中',
      })
      var aub_images = this.data.aub_images.join(',')
      wx.request({
        url: '' + util.ajaxurl + 'add_dynamic.php',
        data: {
          openid: that.data.openid,
          dy_text: that.data.value,
          photoUrl: aub_images
        },
        method: 'GET',
        success: function (res) {
          if(res.data.code==1){
            wx.showToast({
              title: res.data.message
            })
            wx.redirectTo({
              url: '../detil/detil',
            })
          }else{
            wx.showToast({
              icon:'none',
              title: res.data.message,
            })
          }
          
        },
        complete:function(){
          wx.hideLoading()
        }
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
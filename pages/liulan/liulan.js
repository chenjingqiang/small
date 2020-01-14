// pages/liulan/liulan.js
var app = getApp();
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    latitude:'',
    longitude:'',
    get_user: true,
    userInfo: {},
    bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode2.png', '../image/liulan.png', '../image/map2.png'],
    select:[],
    time: 0,
    yinying: true,
    t_f2: true,
    wxid_value:'',
    page:1,
    more_hua:false,
    latitude:'',
    longitude:'',
    value:'',
    sort_status:1,
    sort_status_tf:true,
    search_kong:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var openid = wx.getStorageSync('openid') || ''
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    //console.log(1)
    this.setData({
      openid: openid,
      longitude: longitude,
      latitude: latitude
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: '' + util.ajaxurl +'translator_search.php',
      data: {
        openid: that.data.openid,
        sort_status: that.data.sort_status,
        page: that.data.page,
        limit: 10,
        seach_name: '',
        seach_name_majore: '',
        longitude: that.data.longitude,
        latitude: that.data.latitude
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.data)
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
    var that=this
    //console.log(2)
    util.get_title(this)
    util.get_red(this)
    if (app.globalData.names2){
      var  names2 = app.globalData.names2.join(',')
    }else{
      var names2=''
    }
    that.setData({
      time:0,
      yinying: true,
      t_f2: true,
      names2: names2
    })
    if (app.globalData.search) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      that.setData({
        select:[]
      })
      setTimeout(function(){
        that.search()
      },2000)
    }else{
      //wx.hideLoading()
    }
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
  //搜索功能
  go_biaoqian:function(){
    wx.navigateTo({
      url: '/pages/biaoqian/biaoqian',
    })
  },
  get_value:function(e){
    app.globalData.names2 = ''
    this.setData({
      value:e.detail.value,
      names2: ''
    })
    this.search()
  },
  qingkong:function(){
    app.globalData.names2 = ''
    this.setData({
      value:'',
      names2:''
    })
    this.search()
  },
  dengji:function(){
    this.setData({
      sort_status: 1,
      sort_status_tf: true
    })
    this.search()
  },
  liulanliang: function () {
    this.setData({
      sort_status: 2,
      sort_status_tf: true
    })
    this.search()
  },
  juli: function () {
    this.setData({
      sort_status: 3,
      sort_status_tf: true
    })
    this.search()
  },
  change_sort_status_tf:function(){
    this.setData({
      sort_status_tf: !this.data.sort_status_tf
    })
  },
  search:function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that=this
    that.setData({
      select:[]
    })
    var data={
      openid: that.data.openid,
      sort_status: that.data.sort_status,
      page: 1,
      limit: 10,
      seach_name: that.data.value,
      seach_name_majore: that.data.names2,
      longitude: that.data.longitude,
      latitude: that.data.latitude
    }
    app.globalData.search = false
    wx.request({
      url: '' + util.ajaxurl +'translator_search.php',
      data: data,
      method: 'GET',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data==''){
          that.setData({
            search_kong:true
          })
        }else{
          that.setData({
            search_kong: false
          })
        }
        that.setData({
          select: res.data.data
        })
       
      },
      complete: function () {
        wx.hideLoading()
      }
    })                                                                                                                                               
  },



  //底部导航
  fabu: function () {
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
      url: '' + util.ajaxurl +'translator_search.php',
      data: {
        openid: that.data.openid,
        sort_status: that.data.sort_status,
        page: that.data.page,
        limit: 10,
        seach_name: that.data.value,
        seach_name_majore: that.data.names2,
        longitude: that.data.longitude,
        latitude: that.data.latitude
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
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  }
})
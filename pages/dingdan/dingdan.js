// pages/dingdan/dingdan.js
var aj = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kong:false,
    header: [{ cla: true, tet: '全部' }, { cla: false, tet: '我发布的' }, { cla: false, tet: '我抢到的' }],
    openid:'',
    type:'all',
    select:[],
    tit_money:0,
    shouxufei:0,
    oid:'',
    identity:'',
    yinying_shanchu: false,
    yinying:false,
    yinying_tuidan:false,
    yinying_tuidan2:false,
    yinying_jieshoutuidan: false,
    bar: ['../image/fabu2.png', '../image/dingdan.png', '../image/wode2.png'],
    wode_tf: false,
    textarea_tf: true,
    tit:'',
    status_t_f:false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    var openid=wx.getStorageSync('openid')||''
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
    that.setData({
      yinying: false,
      yinying_tuidan: false,
      yinying_shanchu: false,
      yinying_tuidan2: false,
      yinying_jieshoutuidan:false
    })
    wx.request({
      url: 'https://www.uear.net/ajax2/show_mylist.php',
      data: {
        openid: this.data.openid,
        type:this.data.type
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.data==''){
          that.setData({
            kong: true,
            select:[]
          })
        }else{
          that.setData({
            select: res.data.data,
            kong:false
          })
        }
      }
    })
    wx.request({
      //判断
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
    //获取求译状态
    wx.request({
      url: 'https://www.uear.net/ajax2/check_success.php',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            status_t_f: true,
          })
        }else{
          that.setData({
            status_t_f: false,
          })
        }
      },
    })
   
  },

  qiuyi: function () {
    wx.navigateTo({
      url: '/pages/status/status',
    })
  },
  change:function(e){
    var that=this
    var index = e.currentTarget.dataset.index
    if(index == 0){
      this.setData({
        type:'all'
      })
    } else if (index == 1){
      this.setData({
        type: 'release'
      })
    } else if (index == 2){
      this.setData({
        type: 'receive'
      })
    }
    var change_header = this.data.header;
    for(var i=0;i<change_header.length;i++){
      change_header[i].cla = false
    }
    change_header[index].cla=true;
    this.setData({
      header:change_header
    })
    wx.request({
      url: 'https://www.uear.net/ajax2/show_mylist.php',
      data: {
        openid: this.data.openid,
        type: this.data.type
      },
      method: 'GET',
      success: function (res) {
        if (res.data.data == '') {
          that.setData({
            kong: true,
            select: []
          })
        } else {
          that.setData({
            select: res.data.data, 
            kong: false,
          })
        }
      }
    })
  },
  //删除订单
  dingdan_shanchu: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
      yinying: true,
      yinying_shanchu: true
    })

  },
  shanchu: function () {
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax2/btn_delete.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  //退单
  dingdan_tuidan: function (e) {
    //console.log(e)
    if (e.currentTarget.dataset.identity=="translator"){
      this.setData({
        oid:e.currentTarget.dataset.oid,
        yinying:true,
        yinying_tuidan2:true
      })
    }else{
      //var shouxufei=e.currentTarget.dataset.shouxufei
      var money=e.currentTarget.dataset.money.split('￥')[1].split('.')[0]
      this.setData({
        oid: e.currentTarget.dataset.oid,
        yinying: true,
        yinying_tuidan: true,
        //shouxufei: shouxufei,
        tit_money:money
      })
    }
  },
  tuidan:function(){
    var that = this
    var oid = that.data.oid
    //console.log(oid)
    wx.request({
      url: 'https://www.uear.net/ajax2/btn_tuidan.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '退单成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })  
  },
  //接受退单
  dingdan_jieshoutuidan: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
      yinying: true,
      yinying_jieshoutuidan: true
    })
  },
  jieshoutuidan: function () {
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax2/btn_jieshou.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '退单成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  jujue: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
    })
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax2/btn_jujue.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          wx.showToast({
            title: '拒绝成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  wancheng: function (e) {
    this.setData({
      oid: e.currentTarget.dataset.oid,
    })
    var that = this
    var oid = that.data.oid
    wx.request({
      url: 'https://www.uear.net/ajax2/btn_wancheng.php',
      data: {
        openid: that.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '完成订单',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
          that.onShow()
        }
      }
    })
  },
  zaixiang:function(){
    this.setData({
      yinying: false,
      yinying_shanchu: false,
      yinying_tuidan: false,
      yinying_tuidan2: false,
      yinying_jieshoutuidan: false
    })
  },

  //底部导航
  fabu: function () {
    wx.redirectTo({
      url: '/pages/release/release',
    })
  },
  dingdan: function () {
    wx.redirectTo({
      url: '/pages/dingdan/dingdan',
    })
  },
  wode: function () {
    this.setData({
      wode_tf: true,
      textarea_tf: false,
      bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode.png']
    })
  },
  change_wode_tf: function () {
    this.setData({
      wode_tf: false,
      textarea_tf: true,
      bar: ['../image/fabu2.png', '../image/dingdan.png', '../image/wode2.png']
    })
  },
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
    if (res.from == 'button') {
      var oid = res.target.dataset.oid
      if (res.target.id == 2) {
        return {
          title: this.data.tit,
          imageUrl: "https://www.uear.net/img2/20190513155223.jpg",
          path: '/pages/share/share?oid=' + oid,
        }
      }
    }
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})
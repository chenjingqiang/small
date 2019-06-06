// pages/status/status.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      openid:'',
      tmier:'',
      t_f:true,
      t_f2: true,
      weixin:'',
      status:false,
      tit:'',
      oid:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    wx.setNavigationBarTitle({
      title: '支付成功'
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
    var status = wx.getStorageSync('status') || false
    //console.log(status)
    if (status) {
      that.setData({
        t_f2: false
      })
      wx.setStorageSync('status', false)
    }
    //分享标题
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
    //获取订单id
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/share_order.php',
      data: {
        openid:that.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data.oid)
        that.setData({
          oid: res.data.data.oid
        })
      }
    })
   
    

    clearInterval(that.data.timer)
    var timer = setInterval(function () {
      wx.request({
        url: 'https://www.uear.net/ajax2/check_receive.php',
        data: {
          openid: that.data.openid
        },
        method: 'GET',
        success: function (res) {
          //console.log(res)
          if (res.data.code == 1) {
            wx.request({
              url: 'https://www.uear.net/ajax2/receive_mark.php',
              data: {
                openid: that.data.openid
              },
              method: 'GET',
              success: function (res) {
                //console.log(res)
              }
            })
            clearInterval(that.data.timer)
            that.setData({
              t_f2:true,
              t_f: false,
              weixin: res.data.data.wxid
            })
          } else {
            that.setData({
              t_f: true
            })
            
          }
        },
      })
    }, 2000)
    that.setData({
      timer:timer
    })
    
    
  },
  go_index:function(){
    wx.reLaunch({
      url: '/pages/release/release',
    })
  },
  cancel:function(){
    var that=this
    wx.showModal({
      title: '确定取消订单吗？',
      content: '取消订单后退款可进入钱包，可重新发起翻译单',
      cancelText: "确定", 
      confirmText: "我再想想", 
      confirmColor: '#799DF1', 
      success: function (res) {
        if (!res.confirm) {
          wx.request({
            url: 'https://www.uear.net/ajax2/cancel_order.php',
            data: {
              openid: that.data.openid
            },
            method: 'GET',
            success: function (res) {
              //console.log(res.data)
              if (res.data.code == 1) {
                wx.redirectTo({
                  url: '/pages/release/release',
                })
              }

            }
          })
        } else {
          //console.log('点击取消回调')
        }
      }
    })
    
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.weixin,
      success: function (res) {
      }
    })
  },
  close:function(){
    this.setData({
      t_f2: true
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that=this
    clearInterval(that.data.timer)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var that = this
    clearInterval(that.data.timer)
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
      var oid =this.data.oid
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
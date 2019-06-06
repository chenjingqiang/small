// pages/qianbao/qianbao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxid:'',
    money:'',
    service_charge:'',
    tixian:'',
    tishi: '',
    input_money:0,
    zuidi:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '钱包'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
  },
  change_wx:function(){
    wx.navigateTo({
      url: '/pages/change_wx/change_wx',
    })
  },
  mingxi: function () {
    wx.navigateTo({
      url: '/pages/mingxi/mingxi',
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
      tixian:''
    })
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/show_money.php',
      data: {
        openid: this.data.openid
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          wxid: res.data.data.wxid,
          money: res.data.data.money,
          service_charge: res.data.data.service_charge,
          zuidi: res.data.data.zuidi
        })
      }
    })
  },
  tx_money:function(e){
    var that=this
    //提现金额
    var input_money = Number(e.detail.value)
    var money=Number(this.data.money.split('￥')[1])
    this.setData({
      input_money: input_money
    })
    if (input_money < this.data.zuidi){
      this.setData({
        tishi: '提现金额小于'+this.data.zuidi+'元'
      })
      return
    }
    if (input_money > money) {
      this.setData({
        tishi: '提现金额超过钱包金额'
      })
      return
    }
    wx.request({
      url: 'https://www.uear.net/ajax2/count_withdrawal.php',
      data: {
        money: input_money
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        that.setData({
          tixian: res.data.data,
          tishi: ''
        })
      }
    })
  },
  all:function(){
    var that=this
    var money = Number(this.data.money.split('￥')[1])
    if (money!=0){
      wx.request({
        url: 'https://www.uear.net/ajax2/count_withdrawal.php',
        data: {
          money: money
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data.data)
          that.setData({
            tixian: res.data.data,
            tishi: ''
          })
        }
      })
      this.setData({
        input_money:money,
        tishi: ''
      })
    }
  },
  sub:function(){
    var that=this
    if (this.data.tishi==''&&this.data.tixian!==''){
      wx.request({
        url: 'https://www.uear.net/ajax2/withdrawal.php',
        data: {
          openid: this.data.openid,
          money: this.data.input_money
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if(res.data.code==1){
            wx.showToast({
              title: '提现成功',
              icon: 'succes',
              duration: 1000,
              mask: true
            })
            that.onShow()
          }

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

  }
})
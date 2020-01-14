// pages/qiyue/qiyue.js
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    cid:'',
    detail:'',
    tapTime:'',
    tit:'',
    jia_name:'',
    yi_name: '',
    money: '',
    beizhu: '',
    xieyi:false,
    zhifu:false,
    yinying: true,
    beizhu_box: true,
    t_f: true,
    status:0,
    type:'jia',
    jia_type: false,
    yi_type: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用方法获取机型
    var phone = wx.getSystemInfoSync();  
    if (phone.platform == 'ios') {
      that.setData({
        detail: true
      });
    } else if (phone.platform == 'android') {
      that.setData({
        detail: false
      });
    }
   
    var cid=wx.getStorageSync('cid')||''
    var openid = wx.getStorageSync('openid') || ''
    if(cid===''){
      that.setData({
        type:'jia'
      })
    }else{
      //获取契约详情
      wx.request({
        url: '' + util.ajaxurl + 'contract_detail.php',
        data: {
          openid: openid,
          cid: cid
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.data)
          that.setData({
            jia_type: true,
            jia_name: res.data.data.nail_name,
            money: res.data.data.money,
            beizhu: res.data.data.remark,
          })
          //甲方已签约
          if (res.data.data.status == '1') {
            //甲方已签约 甲方页面
            if (res.data.data.identity_status == '1') {
              that.setData({
                type: 'jia',
                yi_type: true,
                xieyi: true,
                status: 1
              })
              //甲方已签约 乙方页面
            } else {
              that.setData({
                type: 'yi',
                yi_type: false,
                xieyi: false,
                status: 2
              })
            }
          } else {
            //双方已签约
            that.setData({
              yi_type: true,
              yi_name: res.data.data.b_name,
              xieyi: true,
              status: 3,
            })
          }
        }
      })
    }
    that.setData({
      openid: openid,
      cid:cid
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
    util.get_title(this)
  },
  close:function(){
    this.setData({
      yinying:true,
      t_f:true,
      beizhu_box:true
    })
  },
  
  get_jia_name: function (e) { 
    this.setData({
      jia_name:e.detail.value
    })
    this.zhifu_tf()
  },
  get_yi_name: function (e) { 
    this.setData({
      yi_name: e.detail.value
    })
    this.zhifu_tf()
  },
  get_money: function (e) { 
    this.setData({
      money: e.detail.value
    })
    this.zhifu_tf()
  },
  get_beizhu: function (e) { 
    this.setData({
      beizhu: e.detail.value
    })
  },
  change_xieyi: function () {
    this.setData({
      xieyi:true
    })
    this.zhifu_tf()
  },
  //支付的按钮
  zhifu_tf:function(){
    var money =Number(this.data.money)
    //console.log(money)
    if (this.data.type==='jia'){
      if (this.data.jia_name && money && this.data.xieyi){
        this.setData({
          zhifu:true
        })
      }else{
        this.setData({
          zhifu: false
        })
      }
    }else{
      if (this.data.yi_name && money && this.data.xieyi) {
        this.setData({
          zhifu: true
        })
      } else {
        this.setData({
          zhifu: false
        })
      }
    }
  },
  sub:function(){
    // 防止两次点击操作间隔太快
    var that=this
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 2000) {
      wx.showToast({
        title: '请勿频繁点击',
        icon:'none'
      })
      return;
    }
    if (this.data.zhifu){
     var data = {
        cid: this.data.cid,
        openid: this.data.openid,
        money: this.data.money,
        nail_name: this.data.jia_name,
        remark: this.data.beizhu
      }
      wx.request({
        url: '' + util.ajaxurl + 'get_contract.php',
        data: data,
        method: 'GET',
        success: function (res) {
          console.log(res)
          that.setData({
            tapTime: nowTime
          })
          if (res.data.code==1){
            // wx.showToast({
            //   title: res.data.message
            // })
            var cid=res.data.data.cid
            //支付费用
            wx.request({
              url: '' + util.ajaxurl + 'pay_contract.php',
              data: {
                openid: that.data.openid,
                total_fee: that.data.money
              },
              method: 'GET',
              success: function (res) {
                //console.log(res.data.data)
                var data = res.data.data
                wx.requestPayment({
                  timeStamp: data.timeStamp + '',//时间戳
                  nonceStr: data.nonceStr, //随机字符串长度
                  package: data.package,  //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
                  signType: 'MD5', //签名算法
                  paySign: data.paySign,     //签名
                  success(res) {
                    wx.request({
                      url: '' + util.ajaxurl + 'contract_success.php',
                      data: {
                        openid: that.data.openid,
                        cid: cid,
                        money: that.data.money
                      },
                      method: 'GET',
                      success: function (res) {
                        console.log(res)
                        if (res.data.code == 1) {
                          that.setData({
                            cid:res.data.data.cid,
                            yinying:false,
                            t_f:false,
                            beizhu_box:false
                          })
                        }else{
                          wx.showToast({
                            title: res.data.message,
                            icon:'none'
                          })
                        }
                      }
                    })
                  },
                  fail(res) { }
                })

              }
            })
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
         
        }
      })
    }
  },
  sub2:function(){
    var that = this
    var nowTime = new Date();
    if (nowTime - this.data.tapTime < 2000) {
      wx.showToast({
        title: '请勿频繁点击',
        icon: 'none'
      })
      return;
    }
    var data = {
      cid: this.data.cid,
      openid1: this.data.openid,
      b_name: this.data.yi_name,
    }
    if (this.data.zhifu) {
      wx.request({
        url: '' + util.ajaxurl + 'get_contract.php',
        data: data,
        method: 'GET',
        success: function (res) {
          console.log(res)
          that.setData({
            tapTime: nowTime
          })
          if (res.data.code == 1) {
            wx.showToast({
              title: res.data.message,
            })
            this.onLoad()
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none'
            })
          }
        }
      })
    }
  },

  //查看协议
  go_xieyi: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    var that = this
    wx.downloadFile({
      url: 'https://www.uear.net/img/qiyuexieyi.docx', // 可以是后台返回的地址。这里写的是死的
      success: function (res) {
        //console.log(res)
        var filePath = res.tempFilePath; // 小程序中文件的临时文件
        wx.openDocument({
          filePath: filePath,
          fileType: 'docx',
          success: function (res) {
            wx.hideLoading()
          },
          fail: (e) => {
            console.log(e);
            wx.hideLoading()
            wx.showToast({
              title: '打开协议失败,请从新尝试',
              icon: 'none'
            })
          }
        })
      },
      fail: (e) => {
        console.log(e);
        wx.hideLoading()
        wx.showToast({
          title: '下载协议失败',
          icon: 'none'
        })
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
    var share_cid = wx.getStorageSync('share_cid') || ''
    if (share_cid) {
      wx.setStorageSync('share_cid', false)
      wx.setStorageSync('cid', '')
      wx.reLaunch({
        url: '/pages/fly/fly',
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var cid = this.data.cid;
    console.log(cid)
    return {

      title: this.data.tit,

      desc: '分享页面的内容',

      path: '/pages/start/start?cid=' + cid

    }
  
  }
})
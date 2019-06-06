// pages/share/share.js
let interval1, interval2;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oid:'',
    openid:'',
    get_user: true,
    userInfo:'',
    img:'',
    nickname:'',
    money:'',
    now_money:'',
    kong:false,
    select:[],
    height: '380rpx',
    zhankai:true,
    animation_sub:'',
    t_f2:false,
    sub_status:true,
    money:0,
    caiming:'咸菜',
    caiimg: "https://www.uear.net/img2/xiancai.png",
    select2:[],
    danumu:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      oid:options.oid
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
    var openid = wx.getStorageSync('openid')||''
    that.setData({
      t_f2:false,
      zhankai: true,
      openid:openid
    })
    //console.log(that.data.oid)
    //console.log(that.data.openid)
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/share_order_detail.php',
      data: {
        oid:that.data.oid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (!res.data.data.pricehistory){
           that.setData({
             kong: true,
           })
        }else{
          that.setData({
            kong: false,
          })
          var arr_length = res.data.data.pricehistory.length
          //console.log(arr_length)
          if (arr_length>3){
            that.setData({
              zhankai: true,
              height:'380rpx'
            })
          }else{
            var height = arr_length*125+'rpx'
            that.setData({
              zhankai: false,
              height: height
            })
          }
        }that.setData({
          money: res.data.data.money,
          now_money: res.data.data.now_money,
          img: res.data.data.img,
          nickname: res.data.data.nickname,
          select: res.data.data.pricehistory,
          zhankai:res.data.data.zhankai
        })
        
        
      }
    })
    //获取弹幕
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/share_order_detail_rand.php',
      data: {
        oid: that.data.oid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        if (res.data.data==''){
          that.setData({
            danmu:false
          })
        }else{
          that.setData({
            danmu: true
          })
        }
        that.setData({
          select2: res.data.data
        })
      }
    })
  },
  change_hieght:function(){
    var len=this.data.select.length
    //console.log(len)
    var height=125*len+'rpx'
    //console.log(height)
    this.setData({
      height:height,
      zhankai:false
    })
    //console.log(height)
  },
  sub:function(){
    var that=this
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/share_order_refuse.php',
      data: {
        oid: that.data.oid,
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.code)
        if (res.data.code==0){
          //动画
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0.7).step();
          that.setData({
            animation_sub: animation.export(),
          })
          clearTimeout(timer)
          var timer = setTimeout(function () {
            var animation = wx.createAnimation({
              duration: 1000,
            })
            animation.opacity(0).step();
            that.setData({
              animation_sub: animation.export(),
            })
          }, 1000)
        }else{
          that.setData({
            t_f2: true
          })
        }
      }
    })
  },
  close: function () {
    this.setData({
      t_f2: false
    })
  },
  get_money: function (e) {
    //console.log(e.detail.value)
    var that=this
    if (e.detail.value!=''){
      wx.request({
        //判断
        url: 'https://www.uear.net/ajax2/plusprice_order.php',
        data: {
          oid: that.data.oid,
          openid:that.data.openid,
          plus_money: e.detail.value
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.data)
          that.setData({
            caiming:res.data.data.name,
            caiimg: res.data.data.img,
          })
        }
      })
      this.setData({
        money: e.detail.value,
        sub_status:false
      })
    }else{
      that.setData({
        sub_status: true,
        caiming:'咸菜',
        caiimg: "https://www.uear.net/img2/xiancai.png",
      })
    }
  },
  sub2:function(){
    var that=this
    if (!that.data.sub_status){
      wx.request({
        url: 'https://www.uear.net/ajax2/pay.php',
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
                url: 'https://www.uear.net/ajax2/plusmoney_success.php',
                data: {
                  openid: that.data.openid,
                  oid: that.data.oid,
                  money: that.data.money,
                  dishname: that.data.userInfo.nickName,
                  dishimg: that.data.userInfo.avatarUrl
                },
                method: 'GET',
                success: function (res) {
                  if(res.data.code==1){
                    wx.showToast({
                      title: '支付成功',
                      icon: 'succes',
                      duration: 1000,
                      mask: true
                    })
                  }
                }
              })

            },
            fail(res) { }
          })

        }
      })
    }
  },
  go_index:function(){
    var that=this
    
    wx.request({
      //判断
      url: 'https://www.uear.net/ajax2/judge_wx.php',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.code)
        if (res.data.code==1){
          wx.reLaunch({
            url: '/pages/release/release'
          })
        }else{
          wx.reLaunch({
            url: '/pages/index/index'
          })
         
        }
      }
    })

  },
  //获取用户头像
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        getApp().globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(interval1);
    clearInterval(interval2);
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
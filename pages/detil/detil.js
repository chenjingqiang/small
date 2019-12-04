// pages/detil/detil.js
var app = getApp();
var util = require("../../utils/util.js")
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    longitude:'',
    latitude:'',
    yinying: true,
    t_f: true,
    t_f2: true,
    t_f3: true,
    nan_nv:'',
    name: '',
    age: '',
    add1: '',
    add2: '',
    wxid: '',
    picker_value: '',
    biaoqian_select:[],
    yuyan_arr: [],
    beijing: '',
    jingli: '',
    nianxian: '',
    wx_img: '',
    browse: '',
    distance:'',
    flower:[],
    show_dong:true,
    miao:0,
    tempFilePath:'',
    tit:'',
    grade_num:'',
    grade_name:'',
    dj_top:'',
    photoUrl:[],
    page:1,
    select:[],
    zan_tf:false,
    get_user:true,
    baojia:'',
    member_status:'',
    charge_money:'',
    resume_money:'',
    resume_status:'',
    resume_url:''
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
    var detil_id = wx.getStorageSync('detil_id');
    var latitude = wx.getStorageSync('latitude') || ''
    var longitude = wx.getStorageSync('longitude') || ''
    this.setData({
      openid: openid,
      detil_id: detil_id,
      longitude: longitude,
      latitude: latitude
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
    var share_detil = wx.getStorageSync('share_detil') || ''
    if (share_detil){
      wx.getLocation({ // 请求位置信息
        type: 'gcj02',
        success(res) {
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
          wx.setStorageSync('latitude', res.latitude)
          wx.setStorageSync('longitude', res.longitude)
        }
      }) 
    }
    
    innerAudioContext.onEnded(() => {
      //console.log('自动停止')
      this.setData({
        show_dong: true
      })
    })
    //停止播放
    innerAudioContext.onStop(() => {
      //console.log('手动停止')
      this.setData({
        show_dong: true
      })
    })
    
    //增加浏览量
    wx.request({
      url: '' + util.ajaxurl +'browse_plus.php',
      data: {
        openid: detil_id
      },
      method: 'GET',
      success: function (res) {
      }
    })
    //获取翻译官详情
    wx.request({
      url: '' + util.ajaxurl +'trandlator_details.php',
      data: {
        openid: detil_id,
        openid1: this.data.openid,
        longitude: this.data.longitude,
        latitude: this.data.latitude
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data.data)
        var data = res.data.data
        var yuyan2_arr = data.major_certificate
        var yuyan2 = []
        for (var i = 0; i < yuyan2_arr.length; i++) {
          var aaa = yuyan2_arr[i]
          if (i < yuyan2_arr.length - 1) {
            aaa = yuyan2_arr[i] + '、'
          }
          yuyan2.push(aaa)
        }
        if (data.like_status==1){
          that.setData({
            zan_tf:true
          })
        }
        var percentage = data.percentage.split('%')[0]/100
        var dj_top = (160 * percentage)+'rpx'
        if (data.other==''){
          var baojia = '笔译费用：' + data.written_money + '元/千字 、口译费用：' + data.oral_money + '元/小时。'
        }else{
          var baojia = '笔译费用：' + data.written_money + '元/千字 、口译费用：' + data.oral_money + '元/小时，' + data.other
        }
       
        that.setData({
          nan_nv: data.wx_sex,
          name: data.wx_name,
          age: data.wx_age,
          add1: data.country,
          add2: data.city,
          wxid: data.wxid,
          picker_value: data.education,
          yuyan_arr: data.language,
          beijing: data.background,
          jingli: data.work_text,
          nianxian: data.work_years,
          wx_img: data.wx_img,
          browse: data.browse,
          yuyan2_arr: yuyan2,
          names2: data.major_scene,
          source: data.source,
          biaoqian_select: data.major_scene,
          distance: data.distance,
          flower: data.flower,
          miao: data.voice_second,
          tempFilePath: data.voice,
          grade_num: data.grade_num,
          grade_name: data.grade_name,
          dj_top: dj_top,
          photoUrl: data.photoUrl,
          comment_num: data.comment_num,
          wx_likes: data.wx_likes,
          written_money: data.written_money,
          baojia:baojia,
          member_status: data.member_status,
          charge_money: data.charge_money,
          resume_status: data.resume_status,
          resume_url: data.resume_url,
          resume_money: data.resume_money
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
    //评论列表
    wx.request({
      url: '' + util.ajaxurl + 'lists_comment.php',
      data: {
        type: 2,
        type_id: detil_id,
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
    var that=this
    util.get_title(that)
  },
  //跳转简历
  go_jianli:function(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    var that=this
    var data_type = that.data.resume_url.split('.')[3]
    wx.downloadFile({
      url: that.data.resume_url, // 可以是后台返回的地址。这里写的是死的
      success: function (res) {
        //console.log(res)
        var filePath = res.tempFilePath; // 小程序中文件的临时文件
        wx.openDocument({
          filePath: filePath,
          fileType: data_type,
          success: function (res) {
            wx.hideLoading()
            that.setData({
              yinying: true,
              t_f3: true,
            })
          },
          fail: (e) => {
            console.log(e);
            wx.hideLoading()
            wx.showToast({
              title: '打开简历失败,请从新尝试',
              icon:'none'
            })
          }
        })
      },
      fail: (e) => {
        console.log(e);
        wx.hideLoading()
        wx.showToast({
          title: '下载简历失败',
          icon: 'none'
        })
      }
    })
  },
  //更改简历状态
  change_jianli:function(){
    var that = this
    wx.request({
      url: '' + util.ajaxurl + 'ju_pay_re.php',
      data: {
        v_openid: that.data.detil_id,
        u_openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1 || res.data.code == 2){
          that.go_jianli()
        } else if (res.data.code == 3 ){
          that.setData({
            yinying: false,
            t_f3: false,
          })
        }
      }
    })
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
  zhifu:function(e){
    var that=this
    if (e.currentTarget.dataset.money_type =='charge'){
      wx.request({
        url: '' + util.ajaxurl + 'pay.php',
        data: {
          openid: that.data.openid,
          total_fee: that.data.charge_money
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
                url: '' + util.ajaxurl + 'member_success.php',
                data: {
                  v_openid: that.data.detil_id,
                  u_openid: that.data.openid,
                  money: that.data.charge_money
                },
                method: 'GET',
                success: function (res) {
                  if (res.data.code == 1) {
                    that.setData({
                      yinying: false,
                      t_f: false,
                      t_f2: true,
                    })
                  }
                }
              })
            },
            fail(res) { }
          })

        }
      })
    } else if (e.currentTarget.dataset.money_type == 'resume'){
      wx.request({
        url: '' + util.ajaxurl + 'pay_resume.php',
        data: {
          openid: that.data.openid,
          total_fee: that.data.resume_money
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
                url: '' + util.ajaxurl + 'resume_success.php',
                data: {
                  v_openid: that.data.detil_id,
                  u_openid: that.data.openid,
                  money: that.data.resume_money
                },
                method: 'GET',
                success: function (res) {
                  if (res.data.code == 1) {
                    that.go_jianli()
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
  ckwxid: function (e) {
    var that=this
    if (that.data.charge_money==0){
      this.setData({
        yinying: false,
        t_f: false,
      })
      return
    }
    if (this.data.member_status == 1) {
      wx.request({
        url: '' + util.ajaxurl + 'ju_pay_m.php',
        data: {
          v_openid:that.data.detil_id,
          u_openid: that.data.openid,
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1 || res.data.code == 2){
            that.setData({
              yinying: false,
              t_f: false,
            })
          } else if (res.data.code == 3){
            that.setData({
              yinying: false,
              t_f2: false,
            })
          }
        }
      })
    }else{
      //console.log('非会员')
      this.setData({
        yinying: false,
        t_f: false,
      })
    }
  },
  close:function(e){
    if (e.currentTarget.dataset.money_type == 'charge') {
      this.setData({
        yinying: true,
        t_f2: true
      })
    }else{
      this.setData({
        yinying: true,
        t_f3: true
      })
    }
    
  },
  change_wxid: function () {
    this.setData({
      yinying: true,
      t_f: true
    })
  },
  fuzhi: function () {
    var that = this
    wx.setClipboardData({
      data: this.data.wxid,
      success: function (res) {
      }
    })
  },
  //播放录音
  play: function () {
    if (this.data.show_dong) {
      innerAudioContext.src = this.data.tempFilePath,
      innerAudioContext.autoplay = true
      innerAudioContext.play()
      innerAudioContext.onPlay(() => {
        //console.log('开始播放')
      })
      this.setData({
        show_dong: false
      })
    }else{
      innerAudioContext.stop()
      this.setData({
        show_dong: true
      })
    }
  },
  //查看大图
  previewImg: function(e){
    var wx_img =this.data.wx_img;
    var imgArr = []
    imgArr.push(wx_img)
    wx.previewImage({
      current: 1,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  //查看大图
  previewImg2: function (e) {
    var index=e.currentTarget.dataset.imgindex
    var imgArr = this.data.photoUrl
    wx.previewImage({
      current: index,     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
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
        type: 3,
        type_id: that.data.detil_id,
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
  click_zan: function () {
    var that = this
    if (that.data.zan_tf) {
      wx.showToast({
        title: '已经粉蜜过了',
        icon:'none'
      })
      return
    }
    wx.request({
      url: '' + util.ajaxurl + 'get_likes.php',
      data: {
        type: 3,
        type_id: that.data.detil_id,
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
        if (res.data.code == 1) {
          that.onLoad()
        }


      }
    })
  },
  //删除评论
  shanchu_pinglun: function (e) {
    var that = this
    var shanchu_id = e.currentTarget.dataset.shanchu_id
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
        if (res.data.code == 1) {
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
    var share_detil = wx.getStorageSync('share_detil')||''
    if (share_detil){
      wx.setStorageSync('share_detil', false)
      wx.reLaunch({
        url: '/pages/liulan/liulan',
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
      mask: true
    })
    var that = this
    var page = that.data.page + 1
    that.setData({
      page: page
    })
    //评论列表
    wx.request({
      url: '' + util.ajaxurl + 'lists_comment.php',
      data: {
        type: 2,
        type_id: that.data.detil_id,
        openid1: that.data.openid,
        page: page,
      },
      method: 'GET',
      success: function (res) {
        if (res.data.data == '') {
          wx.showToast({
            title: '已经到底了',
            icon: 'none'
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
    var detil_id = wx.getStorageSync('detil_id')||'';
    return {

      title: this.data.tit,

      desc: '分享页面的内容',

      path: '/pages/start/start?detil_id='+detil_id

    }
  }
})
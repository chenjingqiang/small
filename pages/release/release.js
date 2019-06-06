const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid:'',
    wode_tf:false,
    textarea_tf:true,
    t_length:0,
    bar: ['../image/fabu.png', '../image/dingdan2.png', '../image/wode2.png'],
    tit:'',
    dingdan_dian: false,
    yin_box:false,
    luyin_wancheng: false,
    luyin_ing:false,
    luyin_complete:false,
    close_luyin_tf:true,
    miao:1,
    timer:'',
    tempFilePath:'',
    show_dong:true,
    biaoqian_box:false,
    biaoqian_select:[],
    name:true,
    names2: [],
    array:[],
    arr_index:0,
    arr_value:'',
    array2: [],
    arr_index2: 0,
    arr_value2: '',
    money:0,
    zuidi_money:0,
    animation_sub:'',
    sub_box_text:'',
    text:'',
    left:'',
    value:'',
    status_t_f:false,
    get_user:false,
    userInfo:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.setNavigationBarTitle({
      title: '立等翻译官'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    //停止录音
    recorderManager.onStop((res) => {
      if (that.data.close_luyin_tf){
        clearInterval(this.data.timer)
        this.data.tempFilePath = res.tempFilePath;
        //console.log('停止录音', res.tempFilePath)
      }
    })
    //停止播放
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
  },
  onShow: function () {
    //console.log(this.data.openid)
    var that = this
    var app = getApp();
    var getAppInfo = app.globalData.userInfo;
    //console.log(getAppInfo)
    if (!getAppInfo.nickName){
      that.setData({
        get_user:true
      })
    }else{
      that.setData({
        get_user: false
      })
      wx.request({
        url: 'https://www.uear.net/ajax2/wx_information.php',
        data: {
          openid: that.data.openid,
          nickName: app.globalData.userInfo.nickName,
          avatarUrl: app.globalData.userInfo.avatarUrl,
          city: app.globalData.userInfo.city,
          gender: app.globalData.userInfo.gender,

        },
        method: 'GET',
        success: function (res) {
          //console.log(res)
        }
      })
    }
    that.setData({
      arr_index: 0,
      arr_index2: 0
    })
    //获取分享标题
    wx.request({
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
    //获取订单红点
    wx.request({
      url: 'https://www.uear.net/ajax2/redpoint.php',
      data: {
        openid: that.data.openid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 1) {
          that.setData({
            dingdan_dian: true
          })
        }

      }
    })
    //获取标签
    wx.request({
      url: 'https://www.uear.net/ajax2/show_scene.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          biaoqian_select: res.data.data
        })
      }
    })
    
    //获取最低价格
    wx.request({
      url: 'https://www.uear.net/ajax2/check_order1.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        that.setData({
          zuidi_money:res.data.data
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
        } else {
          that.setData({
            status_t_f: false,
          })
        }
      },
    })
    //获取语言
    wx.request({
      url: 'https://www.uear.net/ajax2/show_language.php',
      data: {
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        that.setData({
          arr_value: res.data.data.language1[0],
          array: res.data.data.language1,
          arr_value2: res.data.data.language2[0],
          array2: res.data.data.language2
        })
      }
    })
  },
  //获取用户头像
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      success: function (res) {
        //console.log(res.userInfo)
        getApp().globalData.userInfo = res.userInfo
        wx.request({
          url: 'https://www.uear.net/ajax2/wx_information.php',
          data: {
            openid: that.data.openid,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            gender: res.userInfo.gender,

          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
          }
        })
        that.setData({
          userInfo: res.userInfo,
          get_user: false
        })
      }
    })
    
  },
  qiuyi: function () {
    wx.navigateTo({
      url: '/pages/status/status',
    })
  },
  release:function(){
    wx.redirectTo({
      url: '/pages/release/release',
    })
  },
  translate: function () {
    wx.redirectTo({
      url: '/pages/rob/rob',
    })
  },
  inputs:function(e){
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    this.setData({
      value:value,
      t_length:len
    })
  },
  //开始录音 
  open_luyin_ing:function(){
    innerAudioContext.stop()
    var that=this
    that.setData({
      miao: 1
    })
    clearInterval(that.data.timer)
    var m=1
    that.setData({
      luyin_ing: true,
      yin_box: true,
      luyin_wancheng: false,
      timer: setInterval(function () {
        m += 1
        that.setData({
          miao: m
        })
      }, 1000)
    })
    const options = {
      //duration:5000,
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    //错误回调
    recorderManager.onError((res) => {
      //console.log(res);
    })
  },
  close_luyin_ing: function () {
    var that = this
    that.setData({
      luyin_ing: false,
      yin_box: false,
      miao: 1,
      close_luyin_tf: false,
      tempFilePath: ''
    })
    clearInterval(that.data.timer)
    recorderManager.stop();
  },
  //停止录音
  stop_luyin: function () {
    var that=this
    that.setData({
      luyin_ing: false,
      luyin_complete: true,
      close_luyin_tf: true
    })
    clearInterval(that.data.timer)
    recorderManager.stop();
    
  },
  //播放录音
  play: function () {
    if (this.data.tempFilePath==''){
      return
    }
    this.setData({
      show_dong: false
    })
    innerAudioContext.src = this.data.tempFilePath,
    innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
  },
  wancheng:function(){
    innerAudioContext.stop()
    this.setData({
      luyin_complete: false,
      yin_box:false,
      luyin_wancheng:true
    })
  },
  chonglu: function () {
    innerAudioContext.stop()
    var that = this
    this.setData({
      luyin_complete: false,
      luyin_ing: true,
      miao: 1
    })
    clearInterval(that.data.timer)
    var m = 1
    that.setData({
      luyin_ing: true,
      timer: setInterval(function () {
        m += 1
        that.setData({
          miao: m
        })
      }, 1000)
    })
    const options = {
      //duration:5000,
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    //错误回调
    recorderManager.onError((res) => {
      //console.log(res);
    })
  },
  //打开标签
  open_biaoqian: function () {
    this.setData({
      yin_box:true,
      biaoqian_box:true,
    })
  },
  //关闭标签
  close_biaoqian:function(){
    if(this.data.names2==''){
      this.setData({
        name: true,
        yin_box: false,
        biaoqian_box: false
      })
    }else{
      this.setData({
        yin_box: false,
        biaoqian_box: false
      })
    }
  },
  biaoqian_click:function(e){
    var that=this
    var name = e.currentTarget.dataset.name
    var mark = e.currentTarget.dataset.mark
    var index = e.currentTarget.dataset.index
    var names2 = that.data.names2
    if(mark){
      //console.log('未选中')
      if (that.data.names2.length < 2) {
        if (names2.indexOf(name) == -1) {
          //console.log('没有')
          names2.push(name)
        } else {
          //console.log('有')
        }
        var biaoqian_select = that.data.biaoqian_select
        biaoqian_select[index].mark = !biaoqian_select[index].mark
        that.setData({
          biaoqian_select: biaoqian_select,
        })
      }
    }else{
      //console.log('选中')
      var biaoqian_select = that.data.biaoqian_select
      biaoqian_select[index].mark = !biaoqian_select[index].mark
      that.setData({
        biaoqian_select: biaoqian_select
      })
     var cha_index=names2.indexOf(name);
      names2.splice(cha_index,1)
    }
    that.setData({
      names2: names2
    })
    
  },
  //确认标签
  sub_biaoqian:function(){
    if (this.data.names2 != '') {
      this.setData({
        name:false,
        yin_box: false,
        biaoqian_box: false
      })
    }
  },
  
  bindPickerChange: function (e) {
    this.setData({
      arr_index: e.detail.value,
      arr_value: this.data.array[e.detail.value]
    })
  },
  bindPickerChange2: function (e) {
    this.setData({
      arr_index2: e.detail.value,
      arr_value2: this.data.array2[e.detail.value]
    })
  },

  get_money:function(e){
    //console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },

  sub: function () {
    var that=this
    var query = wx.createSelectorQuery();
    if (this.data.value==''){
      this.setData({
        sub_box_text:'求译具体内容不能为空'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width +'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.money == 0) {
      this.setData({
        sub_box_text: '赏金不能为0元'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if (this.data.money < this.data.zuidi_money) {
      this.setData({
        sub_box_text: '赏金不能低于最低金额哦'
      })
      query.select('.sub_box').boundingClientRect(function (rect) {
        var left = '-' + rect.width + 'rpx'
        that.setData({
          left: left
        })
        var animation = wx.createAnimation({
          duration: 1000,
        })
        animation.opacity(0.7).step();
        that.setData({
          animation_sub: animation.export()
        })
        clearTimeout(timer)
        var timer = setTimeout(function () {
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0).step();
          that.setData({
            animation_sub: animation.export()
          })
        }, 1000)
      }).exec();
      return;
    }
    if(this.data.tempFilePath==''){
      wx.request({
        url: 'https://www.uear.net/ajax2/release.php',
        data: {
          openid: this.data.openid,
          language: this.data.arr_value,
          language2: this.data.arr_value2,
          scene: this.data.names2,
          text: this.data.value,
          money: this.data.money
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            //console.log('下单成功')
            wx.navigateTo({
              url: '/pages/pay/pay',
            })
          }else if(res.data.code== 2){
            that.setData({
              sub_box_text: '用户存在未完成订单'
            })
            query.select('.sub_box').boundingClientRect(function (rect) {
              var left = '-' + rect.width + 'rpx'
              that.setData({
                left: left
              })
              var animation = wx.createAnimation({
                duration: 1000,
              })
              animation.opacity(0.7).step();
              that.setData({
                animation_sub: animation.export()
              })
              clearTimeout(timer)
              var timer = setTimeout(function () {
                var animation = wx.createAnimation({
                  duration: 1000,
                })
                animation.opacity(0).step();
                that.setData({
                  animation_sub: animation.export()
                })
              }, 1000)
            }).exec();
          }
        }
      })
    }else{
      var scene = this.data.names2
      scene = scene.join('-')
      //console.log(scene)
      wx.uploadFile({
        url: 'https://www.uear.net/ajax2/release_voice.php',
        filePath: that.data.tempFilePath,
        name: 'file',
        header: {
          "Content-Type": "multipart/form-data"
        },
        formData: {
          openid: this.data.openid,
          language: this.data.arr_value,
          language2: this.data.arr_value2,
          scene: scene,
          text: this.data.value,
          money: this.data.money,
          second:this.data.miao
        },
        success: function (res) {
          var data = JSON.parse(res.data)
          if (data.code == 1) {
            //console.log('下单成功')
            wx.navigateTo({
              url: '/pages/pay/pay',
            })
          } else if (data.code == 2) {
            that.setData({
              sub_box_text: '用户存在未完成订单'
            })
            query.select('.sub_box').boundingClientRect(function (rect) {
              var left = '-' + rect.width + 'rpx'
              that.setData({
                left: left
              })
              var animation = wx.createAnimation({
                duration: 1000,
              })
              animation.opacity(0.7).step();
              that.setData({
                animation_sub: animation.export()
              })
              clearTimeout(timer)
              var timer = setTimeout(function () {
                var animation = wx.createAnimation({
                  duration: 1000,
                })
                animation.opacity(0).step();
                that.setData({
                  animation_sub: animation.export()
                })
              }, 1000)
            }).exec();
          }
        },
        fail: function () {
        }
      })
    }
    
   
  },
  onPageScroll: function (e) {
    //console.log(e.scrollTop)
    if (e.scrollTop>30){
      this.setData({
        textarea_tf: false
      })
    }else{
      this.setData({
        textarea_tf: true
      })
    }
  },



















  
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
      wode_tf:true,
      textarea_tf: false,
      bar: ['../image/fabu2.png', '../image/dingdan2.png', '../image/wode.png']
    })
  },
  change_wode_tf:function(){
    this.setData({
      wode_tf: false,
      textarea_tf: true,
      bar: ['../image/fabu.png', '../image/dingdan2.png', '../image/wode2.png']
    })
  },
  go_qianbao:function(){
    wx.navigateTo({
      url: '/pages/qianbao/qianbao',
    })
  },
  go_yijian: function () {
    wx.navigateTo({
      url: '/pages/yijian/yijian',
    })
  },
  // 转发
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    recorderManager.stop()
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    recorderManager.stop()
    innerAudioContext.stop()
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.tit,
      imageUrl: "https://www.uear.net/img2/start.jpg",
      path: '/pages/start/start',
    }
  },
})
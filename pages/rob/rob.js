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
    height:'',
    animationData: "",
    paixu:'desc',
    order_status: 0,
    select:[],
    fu_id:'',
    animation_shibai:'',
    animation_shibai2: '',
    kong: false,
    index:0,
    status_t_f:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '立等翻译官'
    })
    var openid = wx.getStorageSync('openid') || ''
    this.setData({
      openid: openid
    })
    //停止播放
    innerAudioContext.onEnded(() => {
      //console.log('自动停止')
      var select=this.data.select
      select[this.data.index].dong = false
      this.setData({
        select: select
      })
    })
    //停止播放
    innerAudioContext.onStop(() => {
      //console.log('手动停止')
      var select = this.data.select
      select[this.data.index].dong = false
      this.setData({
        select: select
      })
    })
    
  },
  //更改顺序
  change_paixu:function(){
    if (this.data.paixu =='desc'){
      this.setData({
        paixu: 'asc'
      })
    }else{
      this.setData({
        paixu: 'desc'
      })
    }
    this.onShow()
  },
  //更改抢单状态
  change_rob: function () {
    if (this.data.order_status==0) {
      this.setData({
        order_status:1
      })
    } else {
      this.setData({
        order_status: 0
      })
    }
    this.onShow()

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
  
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    //初始动画
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "linear",
      delay: 0,
    })
    animation.height(0).step()
    that.setData({
      animationData: animation.export(),
    })
    that.setData({
      select:[],
      kong:false
    })
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
          tit:res.data.data
        })
      }
    })
    //提示点
    wx.request({
      url: 'https://www.uear.net/ajax2/redpoint.php',
      data: {
        openid:that.data.openid
      },
      method: 'GET',
      success: function (res) {
        if(res.data.code==1){
          that.setData({
            dingdan_dian: true
          })
        }
        
      }
    })
    wx.request({
      url: 'https://www.uear.net/ajax2/show_order.php',
      data: {
        openid:this.data.openid,
        orderby:this.data.paixu,
        order_status: this.data.order_status
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.data==''){
          that.setData({
            kong:true
          })
        }else{
          that.setData({
            select: res.data.data
          })
        }
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
    
  },
  //下拉动画
  gettextHeight: function (e) {
    if (e.currentTarget.dataset.text_mark){
      var that = this
      var fu_id = e.currentTarget.dataset.oid
      var index = e.currentTarget.dataset.index
      var change_select=that.data.select
      change_select[index].text_mark=false
      change_select[index].text_short = ''
      that.setData({
        fu_id: fu_id,
        select:change_select
      })
      var zi_id = e.currentTarget.dataset.oid2
      const query = wx.createSelectorQuery()
      var iii = '#' + zi_id
      query.select(iii).boundingClientRect()
      query.exec(function (res) {
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: "linear",
          delay: 0,
        })
        animation.height(res[0].height).step()
        that.setData({
          animationData: animation.export(),
        })
      })

    }
    
  },
  //播放录音
  play: function (res) {
    var index = res.currentTarget.dataset.index
    var mp3 = res.currentTarget.dataset.mp3
    var select=this.data.select
    for(var i=0;i<select.length;i++){
      select[i].dong=false
    }
    select[index].dong = true
    this.setData({
      index:index,
      select:select
    })
    innerAudioContext.src = mp3,
    innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
  },
  //刷新
  shuaxin:function(){
    this.onShow()
  },
  qiuyi: function () {
    wx.navigateTo({
      url: '/pages/status/status',
    })
  },
  //抢单
  sub:function (e){
    var that=this
    var oid = e.currentTarget.dataset.oid
    wx.request({
      url: 'https://www.uear.net/ajax2/receive.php',
      data: {
        openid: this.data.openid,
        oid: oid
      },
      method: 'GET',
      success: function (res) {
        if(res.data.code==1){
          wx.setStorageSync('oid', oid)
          wx.navigateTo({
            url: '/pages/success/success',
          })
        } else if (res.data.code == 0){
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0.7).step();
          that.setData({
            animation_shibai: animation.export()
          })
          clearTimeout(timer)
          var timer = setTimeout(function () {
            var animation = wx.createAnimation({
              duration: 1000,
            })
            animation.opacity(0).step();
            that.setData({
              animation_shibai: animation.export()
            })
          }, 1000)
        } else if (res.data.code == 2){
          var animation = wx.createAnimation({
            duration: 1000,
          })
          animation.opacity(0.7).step();
          that.setData({
            animation_shibai2: animation.export()
          })
          clearTimeout(timer)
          var timer = setTimeout(function () {
            var animation = wx.createAnimation({
              duration: 1000,
            })
            animation.opacity(0).step();
            that.setData({
              animation_shibai2: animation.export()
            })
          }, 1000)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.stop()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
    if (res.from=='button'){
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
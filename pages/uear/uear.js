// pages/uear/uear.js
const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordState: false, //录音状态
    content: '',//内容
    lang:'',
    select: [],
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //识别语音
    var that=this
    this.initRecord();
    //语音自动停止
    innerAudioContext.onEnded(() => {
      console.log('自动停止')
    })
    //语音手动停止
    innerAudioContext.onStop(() => {
      console.log('手动停止')
    })
    this.go_bottom()
  },
  //识别语音 -- 初始化
  initRecord: function () {
    const that = this;
    // 有新的识别内容返回，则会调用此事件
    manager.onRecognize = function (res) {
      console.log(res)
      var top = Math.ceil(that.data.content.length / 12) * 100
      that.setData({
        content: res.result,
        scrollTop: top
      })
      
    }
    // 正常开始录音识别时会调用此事件
    manager.onStart = function (res) {
      //console.log("成功开始录音识别", res)
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) { }
        })
        return;
      }
    }
    // 识别错误事件
    manager.onError = function (res) {
      //console.error("error msg", res)
    }
    //识别结束事件
    manager.onStop = function (res) {
      //console.log('..............结束录音')
      // console.log('录音临时文件地址 -->' + res.tempFilePath);
      // console.log('录音总时长 -->' + res.duration + 'ms');
      // console.log('文件大小 --> ' + res.fileSize + 'B');
      // console.log('语音内容 --> ' + res.result);
      if (res.result == '') {
        wx.showModal({
          title: '提示',
          content: '听不清楚，请重新说一遍！',
          showCancel: false,
          success: function (res) { }
        })
        return;
      }else{
        if (that.data.lang =='en_US'){
          var lfrom= 'en_US'
          var lto ='zh_CN'
          var float ='left'
        }else{
          var lfrom = 'zh_CN'
          var lto = 'en_US'
          var float = 'right'
        }
        plugin.translate({
          lfrom: lfrom,
          lto: lto,
          tts: true,
          content: res.result,
          success: function (res) {
            if (res.retcode == 0) {
              var arr = [{ 'top': res.origin, 'bottom': res.result, 'float': float, 'src': res.filename }]
              that.setData({
                select: that.data.select.concat(arr),
                content:''
              })
              that.go_bottom()
              innerAudioContext.src = res.filename
              innerAudioContext.autoplay = true
              innerAudioContext.play()
              innerAudioContext.onPlay(() => {
                //console.log('开始播放')
              })
            } else {
              console.warn("翻译失败", res)
            }
          },
          fail: function (res) {
            console.log("网络失败", res)
          }
        })
        
      }

    }
  },
  //语音  --按住说话
  touchStart: function (e) {
    var that=this
    that.setData({
      top: '0'
    })
    if (e.currentTarget.dataset.en_ch=='en'){
      that.setData({
        lang:'en_US'
      })
    }else{
      that.setData({
        lang: 'zh_CN'
      })
    }
    that.setData({
      recordState: true  //录音状态,
    })
    // 语音开始识别
    manager.start({
      lang: that.data.lang,// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
    })
  },
  //语音  --松开结束
  touchEnd: function (e) {
    this.setData({
      recordState: false
    })
    // 语音结束识别
    manager.stop();
  },
  play:function(e){
    var src = e.currentTarget.dataset.src
    innerAudioContext.src = src
    innerAudioContext.autoplay = true
    innerAudioContext.play()
    innerAudioContext.onPlay(() => {
      //console.log('开始播放')
    })
  },
  go_bottom:function(){
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height
      })
    }).exec()
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
  handleLongPress:function(){
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
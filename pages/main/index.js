// pages/main/index.js
var QR = require("../../utils/qrcode.js");
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data:{
    /*
    官网说hidden只是简单的控制显示与隐藏，组件始终会被渲染，
    但是将canvas转化成图片走的居然是fail，hidden为false就是成功的
    所以这里手动控制显示隐藏canvas
    */
    feed: [],
    feed_length: 0,
    num: 1,
    fee: 2,
    minusStatus: 'disabled',
    maskHidden:true,
    imagePath:'',
    placeholder:'getweapp.com'
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var size = this.setCanvasSize();//动态设置画布大小
    var initUrl = "http://"+this.data.placeholder;
    this.createQrCode(initUrl,"mycanvas",size.w,size.h);

  },
  onReady:function(){
    
  },
  onShow:function(){
    
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },

  onUnload:function(){
    // 页面关闭

  },
  //事件处理函数
  bindTimeCounter: function () {
    console.log("test");


    // Update the count down every 1 second

    var x = setInterval(this.timer, 1000);




  },
  timer() {
    var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime();
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = countDownDate - now;

    //console.log(distance);
    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);



    // If the count down is finished, write some text 
    if (distance < 0) {
      this.setData({
        text: document.getElementById("demo").innerHTML = "EXPIRED"
      })
    } else {
      this.setData({
        text: days + "d " + hours + "h "
        + minutes + "m " + seconds + "s "
      })
    }
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  bindConfirm: function () {

  },
  //适配不同屏幕大小的canvas
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      } 
    return size;
  } ,
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.qrApi.draw(url,canvasId,cavW,cavH);
    var that = this;
    //二维码生成之后调用canvasToTempImage();延迟3s，否则获取图片路径为空
    var st = setTimeout(function(){
      that.canvasToTempImage();
      clearTimeout(st);
    },3000);
    
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
              imagePath:tempFilePath,
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    var img = this.data.imagePath
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
  formSubmit: function(e) {
    var that = this;
    var url = e.detail.value.url;
    url = url==''?('http://'+that.data.placeholder):('http://'+url);
    that.setData({
      maskHidden:false,
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration:2000
    });
    var st = setTimeout(function(){
      wx.hideToast()
      var size = that.setCanvasSize();
      //绘制二维码
      that.createQrCode(url,"mycanvas",size.w,size.h);
      that.setData({
        maskHidden:true
      });
      clearTimeout(st);
    },2000)
    
  }

})
Page({
  data: {
    currentDate: '',
    // 图标数组
    icons: [
      '/images/icon_star.png',
      '/images/icon_data.png',
      '/images/icon_work.png',
      '/images/icon_fan.png',
      '/images/icon_my.png'
    ],
    // 当前显示的图标索引
    currentIconIndex: 0,
    // 当前显示的图标
    currentIcon: '/pages/index/lip.png',
    // 用于显示的图片数组
    displayImages: [
      '/pages/index/orm.png'
    ],
    displayImage1: '/pages/index/login-bg.jpg',
    showHome: true,
    // 当前显示的图片索引
    currentDisplayIndex: 0,
    // 当前显示的图片
    displayImage: '/pages/index/lip.png',
    // 图标位置
    iconLeft: 150,
    iconTop: '100vh',
    // 拖动相关数据
    startPoint: null
  },

  onLoad: function () {
    // 设置当前日期
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    this.setData({
      currentDate: `${year}年${month}月${day}日`
    });
  },

  onShow: function () {

  },

  // 触摸开始事件
  onTouchStart: function (e) {
    const touch = e.touches[0];
    this.setData({
      startPoint: {
        x: touch.clientX,
        y: touch.clientY,
        left: this.data.iconLeft,
        top: this.data.iconTop
      }
    });
  },

  // 触摸移动事件
  onTouchMove: function (e) {
    if (!this.data.startPoint) return;

    const touch = e.touches[0];
    const startPoint = this.data.startPoint;

    // 计算移动距离
    const deltaX = touch.clientX - startPoint.x;
    const deltaY = touch.clientY - startPoint.y;

    // 更新图标位置
    this.setData({
      iconLeft: startPoint.left + deltaX,
      iconTop: startPoint.top + deltaY
    });
  },

  // 触摸结束事件
  onTouchEnd: function (e) {
    this.setData({
      startPoint: null
    });
  },

  // 长按切换显示图片
  switchDisplayImage: function () {
    // 切换显示图片
    const nextDisplayIndex = (this.data.currentDisplayIndex + 1) % this.data.displayImages.length;
    const nextDisplayImage = this.data.displayImages[nextDisplayIndex];

    // 更新数据
    this.setData({
      currentDisplayIndex: nextDisplayIndex,
      displayImage: nextDisplayImage,
      showHome: false,
      displayImage1: '/pages/index/have-to.jpg',
    });


    // // 显示提示
    // wx.showToast({
    //   title: '图片已切换',
    //   icon: 'success',
    //   duration: 1000
    // });
  }
});
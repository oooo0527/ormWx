Page({
  data: {
    currentSlide: 0,
    selectedWork: null,

  },

  onLoad: function () {

  },

  // 返回作品列表
  backToList: function () {

  },

  // 轮播图切换事件
  onSwiperChange: function (e) {
    const current = e.detail.current;
    this.setData({
      currentSlide: current,
      selectedWork: this.data.works[current]
    });
  },

  // 轮播图图片点击事件
  onSwiperImageTap: function (e) {
    // 可以在这里添加点击图片的处理逻辑
    console.log("点击了轮播图图片");
  }
});
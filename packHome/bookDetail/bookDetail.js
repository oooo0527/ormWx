Page({
  data: {
    Box: {},
    showImageList: false,
    activeIndex: 0,  // 当前展开的图片索引

    loading: true // 数据加载状态
  },

  onLoad(options) {
    // 获取从上一页传递过来的数据
    const eventChannel = this.getOpenerEventChannel();
    console.log('eventChannel', eventChannel)
    eventChannel.on('acceptDataFromBookPage', (data) => {
      this.setData({
        Box: data.Box,
        loading: false
      });

      // 设置页面标题
      wx.setNavigationBarTitle({
        title: data.Box.title
      });
    });



  },


  // 图片点击事件 - 实现展开收起效果
  onImageClick(e) {
    const index = e.currentTarget.dataset.index;
    const currentIndex = this.data.activeIndex;
    const targetIndex = parseInt(index);



    // 设置动画类
    this.setData({
      activeIndex: targetIndex,
    });


  },

  // 图片预览事件
  onImageTap(e) {
    const index = e.currentTarget.dataset.index;

    // 预览图片
    const urls = this.data.images.map(item => item.url);
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },

});
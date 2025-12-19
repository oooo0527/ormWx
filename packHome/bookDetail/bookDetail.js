Page({
  data: {
    bookId: null,
    title: '',
    images: []
  },

  onLoad(options) {
    const bookId = options.bookId;
    const title = options.title;

    // 根据bookId获取对应的图片数据
    // 这里模拟从服务器或本地获取数据
    const imageData = this.getImageData(bookId);

    this.setData({
      bookId: bookId,
      title: title,
      images: imageData
    });

    // 设置页面标题
    wx.setNavigationBarTitle({
      title: title
    });
  },

  getImageData(bookId) {

  },


});
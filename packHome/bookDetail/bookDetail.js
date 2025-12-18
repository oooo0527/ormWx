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
    // 模拟数据，实际项目中应该从服务器获取
    const imageDataMap = {
      '1': [
        { url: 'https://img-blog.csdnimg.cn/202305061523410.jpg', desc: '童年回忆1' },
        { url: 'https://img-blog.csdnimg.cn/202305061523411.jpg', desc: '童年回忆2' },
        { url: 'https://img-blog.csdnimg.cn/202305061523412.jpg', desc: '童年回忆3' }
      ],
      '2': [
        { url: 'https://img-blog.csdnimg.cn/202305061523413.jpg', desc: '青春时光1' },
        { url: 'https://img-blog.csdnimg.cn/202305061523414.jpg', desc: '青春时光2' },
        { url: 'https://img-blog.csdnimg.cn/202305061523415.jpg', desc: '青春时光3' }
      ],
      '3': [
        { url: 'https://img-blog.csdnimg.cn/202305061523416.jpg', desc: '成长足迹1' },
        { url: 'https://img-blog.csdnimg.cn/202305061523417.jpg', desc: '成长足迹2' },
        { url: 'https://img-blog.csdnimg.cn/202305061523418.jpg', desc: '成长足迹3' }
      ],
      '4': [
        { url: 'https://img-blog.csdnimg.cn/202305061523419.jpg', desc: '梦想启航1' },
        { url: 'https://img-blog.csdnimg.cn/202305061523420.jpg', desc: '梦想启航2' },
        { url: 'https://img-blog.csdnimg.cn/202305061523421.jpg', desc: '梦想启航3' }
      ],
      '5': [
        { url: 'https://img-blog.csdnimg.cn/202305061523422.jpg', desc: '美好未来1' },
        { url: 'https://img-blog.csdnimg.cn/202305061523423.jpg', desc: '美好未来2' },
        { url: 'https://img-blog.csdnimg.cn/202305061523424.jpg', desc: '美好未来3' }
      ]
    };

    return imageDataMap[bookId] || [];
  },

  // 点击图片预览
  onImageTap(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.images.map(item => item.url);

    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  }
});
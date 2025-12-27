Page({
  data: {
    bookId: null,
    title: '',
    images: [],
    showImageList: false,
    activeIndex: 0,  // 当前展开的图片索引
    animationClassList: [],  // 动画类列表
  },

  onLoad(options) {
    const bookId = options.bookId;
    const title = options.title;

    // 根据bookId获取对应的图片数据
    // 这里模拟从服务器或本地获取数据
    const imageData = this.getImageData();

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

  getImageData() {
    // 示例数据 - 实际项目中应从服务器获取

    return [
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
      { url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/behind/098bb43a246b28b40ea277fb4a820460.jpg', desc: '这是图片1的描述' },
    ];

  }

});
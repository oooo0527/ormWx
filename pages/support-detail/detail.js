
Page({
  data: {
    supportDetail: {
      id: '',
      title: '',
      description: '',
      coverImage: '',
      date: '',
      year: '',
      location: '',
      images: []
    }
  },

  onLoad: function (options) {
    // 接收传递的参数
    const id = options.id || '';

    // 通过事件通道接收数据
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      // 如果有传递的数据，使用传递的单条数据
      console.log(data, 'supportDetail');
      if (data) {


        this.setData({
          supportDetail: data
        });
      } else {
        // 如果没有传递数据，使用默认数据
        this.loadDefaultData(id);
      }
    });
  },

  // 加载默认数据
  loadDefaultData: function (id) {
    // 这里应该根据id从数据库或云函数获取详情数据
    // 模拟数据
    const detail = {
      id: id,
      title: "Orm生日应援活动",
      description: "中国粉丝为Orm举办的2025年生日应援活动，包含视频、图片等多种形式的祝福",
      coverImage: "/images/default_avatar.png",
      date: "05",
      year: "2025",
      location: "曼谷",
      images: [
        "/images/default_avatar.png",
        "/images/default_avatar.png",
        "/images/default_avatar.png"
      ]
    };

    this.setData({
      supportDetail: detail
    });
  },

  // 预览图片
  previewImage: function (e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: this.data.supportDetail.images,
      current: url
    });
  }
})
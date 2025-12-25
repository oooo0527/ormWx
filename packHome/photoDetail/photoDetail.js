// packHome/dream/photoDetail.js
Page({
  data: {
    styleName: '',
    photos: [],

  },

  onLoad(options) {
    const styleName = options.style;
    this.setData({
      styleName: styleName
    });



    // 检查是否有传递过来的照片数据
    if (options.photos) {
      // 解析传递过来的照片数据
      const photos = JSON.parse(decodeURIComponent(options.photos));
      let list = photos;

      this.setData({
        photos: list
      });
    } else {
      // 如果没有传递照片数据，则调用云函数加载
      this.loadPhotosByStyle(styleName);
    }
  },

  // 加载指定风格的照片
  loadPhotosByStyle(styleName) {
    console.log('加载指定风格的照片:', styleName);
    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'getPhotosByStyle',
        style: styleName
      },
      success: res => {
        if (res.result && res.result.success) {
          let list = res.result.data;

          this.setData({
            photos: list
          });
        } else {
          console.error('获取照片失败:', res.result ? res.result.message : '未知错误');
          wx.showToast({
            title: '获取照片失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('获取照片失败:', err);
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        });
      }
    });
  },





  // 查看大图
  viewPhoto(e) {
    const imageUrl = e.currentTarget.dataset.image;
    const urls = this.data.photos.map(photo => photo.imageUrl);
    const currentIndex = this.data.photos.findIndex(photo => photo.imageUrl === imageUrl);

    // 获取当前照片信息
    const currentPhoto = this.data.photos[currentIndex];

    // 记录浏览记录
    this.recordView(currentPhoto._id);

    wx.previewImage({
      urls: urls,
      current: imageUrl
    });
  },

  // 记录浏览记录
  recordView(photoId) {
    if (!photoId) return;

    // 获取已浏览的照片ID列表
    let viewedPhotoIds = wx.getStorageSync('viewedDreamPhotoIds') || [];

    // 检查是否已经记录过该照片的浏览
    if (!viewedPhotoIds.includes(photoId)) {
      // 添加到已浏览列表
      viewedPhotoIds.push(photoId);
      wx.setStorageSync('viewedDreamPhotoIds', viewedPhotoIds);

      // 调用云函数增加浏览次数
      wx.cloud.callFunction({
        name: 'submitDreamPhoto',
        data: {
          action: 'recordView',
          photoId: photoId
        },
        success: res => {
          console.log('浏览记录成功:', res);

          // 更新本地照片的浏览数
          const updatedPhotos = this.data.photos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                views: (photo.views || 0) + 1
              };
            }
            return photo;
          });

          this.setData({
            photos: updatedPhotos
          });
        },
        fail: err => {
          console.error('浏览记录失败:', err);
        }
      });
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
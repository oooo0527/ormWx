// packHome/dream/photoDetail.js
Page({
  data: {
    styleName: '',
    photos: [],
    likedPhotoIds: []
  },

  onLoad(options) {
    const styleName = options.style;
    this.setData({
      styleName: styleName
    });

    // 从本地存储中获取已点赞的照片ID
    const likedPhotoIds = wx.getStorageSync('likedDreamPhotoIds') || [];
    this.setData({
      likedPhotoIds: likedPhotoIds
    });

    // 检查是否有传递过来的照片数据
    if (options.photos) {
      // 解析传递过来的照片数据
      const photos = JSON.parse(decodeURIComponent(options.photos));
      this.setData({
        photos: photos
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
          this.setData({
            photos: res.result.data
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

  // 点赞功能
  likePhoto(e) {
    const photoId = e.currentTarget.dataset.id;
    const photoIndex = e.currentTarget.dataset.index;

    // 检查是否已经点赞过
    if (this.data.likedPhotoIds.includes(photoId)) {
      wx.showToast({
        title: '您已经点赞过了',
        icon: 'none'
      });
      return;
    }

    // 调用云函数处理点赞
    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'likePhoto',
        photoId: photoId
      },
      success: res => {
        if (res.result && res.result.success) {
          // 更新前端显示的点赞数
          const photos = [...this.data.photos];
          photos[photoIndex].likes = (photos[photoIndex].likes || 0) + 1;

          // 将照片ID添加到已点赞列表中
          const likedPhotoIds = [...this.data.likedPhotoIds, photoId];

          this.setData({
            photos: photos,
            likedPhotoIds: likedPhotoIds
          });

          // 将已点赞的照片ID保存到本地存储中
          wx.setStorageSync('likedDreamPhotoIds', likedPhotoIds);

          wx.showToast({
            title: '点赞成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.result ? res.result.message : '点赞失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('点赞失败:', err);
        wx.showToast({
          title: '点赞失败',
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

    wx.previewImage({
      urls: urls,
      current: imageUrl
    });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
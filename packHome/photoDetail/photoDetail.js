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
    console.log('已点赞的照片ID:', likedPhotoIds)
    this.setData({
      likedPhotoIds: likedPhotoIds
    });

    // 检查是否有传递过来的照片数据
    if (options.photos) {
      // 解析传递过来的照片数据
      const photos = JSON.parse(decodeURIComponent(options.photos));
      let list = photos.map(item => {
        if (this.data.likedPhotoIds.includes(item._id)) {
          item.isLiked = true;
        } else {
          item.isLiked = false;
        }
        return item;
      });

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
          let list = res.result.data.map(item => {
            if (this.data.likedPhotoIds.includes(item._id)) {
              item.isLiked = true;

            } else {
              item.isLiked = false;
            }
            return item;
          });

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

  // 点赞功能
  likePhoto(e) {
    const photoId = e.currentTarget.dataset.id;
    const photoIndex = e.currentTarget.dataset.index;

    // 检查是否已经点赞过
    if (this.data.likedPhotoIds.includes(photoId)) {
      // 如果已经点赞，则取消点赞
      this.cancelLikePhoto(photoId, photoIndex);
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
          photos[photoIndex].isLiked = true;
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

  // 取消点赞功能
  cancelLikePhoto(photoId, photoIndex) {
    // 调用云函数处理取消点赞
    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'likePhoto',
        photoId: photoId,
        cancelLike: true
      },
      success: res => {
        if (res.result && res.result.success) {
          // 更新前端显示的点赞数
          const photos = [...this.data.photos];
          photos[photoIndex].isLiked = false;
          photos[photoIndex].likes = Math.max(0, (photos[photoIndex].likes || 0) - 1); // 确保不会小于0

          // 从已点赞列表中移除照片ID
          const likedPhotoIds = this.data.likedPhotoIds.filter(id => id !== photoId);

          this.setData({
            photos: photos,
            likedPhotoIds: likedPhotoIds
          });

          // 更新本地存储中的已点赞照片ID
          wx.setStorageSync('likedDreamPhotoIds', likedPhotoIds);

          wx.showToast({
            title: '取消点赞成功',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: res.result ? res.result.message : '取消点赞失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('取消点赞失败:', err);
        wx.showToast({
          title: '取消点赞失败',
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
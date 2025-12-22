// packHome/dream/dream.js
const timeUtils = require('../../utils/timeUtils.js');
Page({
  data: {
    activeTab: 'ranking', // 默认显示排行榜
    userInfo: null,
    // 不同风格的照片数据
    photoStyles: [],
    // 排行榜数据
    rankingList: [],
    // 弹窗相关数据
    showModal: false,
    selectedItem: null,
    // 审核通过的照片
    approvedPhotos: [],
    // 按风格分组的照片
    groupedPhotos: {},
    // 已点赞的照片ID列表（用于防止重复点赞）
    likedPhotoIds: []
  },
  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
  },

  onLoad(options) {
    // 检查用户登录状态
    const app = getApp();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    }

    // 加载审核通过的照片
    this.loadApprovedPhotos();

    // 加载排行榜数据
    this.loadRankingList();

    // 从本地存储中获取已点赞的照片ID
    const likedPhotoIds = wx.getStorageSync('likedDreamPhotoIds') || [];
    this.setData({
      likedPhotoIds: likedPhotoIds
    });

    // 检查是否有tab参数，如果有则切换到对应标签页
    if (options.tab) {
      this.setData({
        activeTab: options.tab
      });
    }
  },

  onShow() {
    // 页面显示时的操作
  },



  // 加载审核通过的照片
  loadApprovedPhotos() {
    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'getApprovedPhotos'
      },
      success: res => {
        if (res.result && res.result.success) {
          // 按风格分组照片
          const groupedPhotos = this.groupPhotosByStyle(res.result.data);

          this.setData({
            approvedPhotos: res.result.data,
            groupedPhotos: groupedPhotos
          });
        } else {
          console.error('获取审核通过照片失败:', res.result ? res.result.message : '未知错误');
        }
      },
      fail: err => {
        console.error('获取审核通过照片失败:', err);
      }
    });
  },

  // 按风格分组照片
  groupPhotosByStyle(photos) {
    const grouped = {};

    photos.forEach(photo => {
      const style = photo.style || '未分类';
      if (!grouped[style]) {
        grouped[style] = [];
      }
      grouped[style].push(photo);
    });

    return grouped;
  },

  // 查看风格详情
  viewStyleDetail(e) {
    console.log('查看风格详情', e, this.data.groupedPhotos);
    const style = e.currentTarget.dataset.style;
    console.log('点击的风格:', style);

    // 检查style是否为空
    if (!style) {
      wx.showToast({
        title: '无法获取风格信息',
        icon: 'none'
      });
      return;
    }

    // 获取该风格下的所有照片
    const photos = this.data.groupedPhotos[style] || [];

    // 将照片数据转换为JSON字符串传递
    const photosJson = encodeURIComponent(JSON.stringify(photos));

    wx.navigateTo({
      url: `/packHome/photoDetail/photoDetail?style=${style}&photos=${photosJson}`
    });
  },

  // 加载排行榜数据
  loadRankingList() {
    wx.cloud.callFunction({
      name: 'submitDreamPhoto',
      data: {
        action: 'getRankingList'
      },
      success: res => {
        if (res.result && res.result.success) {
          console.log('排行榜数据:', res.result.data); // 添加日志查看数据结构

          this.setData({
            rankingList: res.result.data,

          });
        } else {
          console.error('获取排行榜数据失败:', res.result ? res.result.message : '未知错误');
        }
      },
      fail: err => {
        console.error('获取排行榜数据失败:', err);
      }
    });
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      activeTab: tab
    });
  },

  // 点赞功能
  likePhoto(e) {
    const photoId = e.currentTarget.dataset._id;

    // 检查是否已经点赞过
    if (this.data.likedPhotoIds.includes(photoId)) {
      // 如果已经点赞，则取消点赞
      this.cancelLikePhoto(photoId);
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
          const approvedPhotos = this.data.approvedPhotos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                isLiked: true,
                likes: (photo.likes || 0) + 1
              };
            }
            return photo;
          });

          // 更新分组照片中的点赞数
          const groupedPhotos = { ...this.data.groupedPhotos };
          for (const style in groupedPhotos) {
            groupedPhotos[style] = groupedPhotos[style].map(photo => {
              if (photo._id === photoId) {
                return {
                  ...photo,
                  isLiked: true,
                  likes: (photo.likes || 0) + 1
                };
              }
              return photo;
            });
          }

          // 将照片ID添加到已点赞列表中
          const likedPhotoIds = [...this.data.likedPhotoIds, photoId];

          this.setData({
            approvedPhotos: approvedPhotos,
            groupedPhotos: groupedPhotos,
            likedPhotoIds: likedPhotoIds
          }, () => {
            // 数据更新完成后的回调
            console.log('点赞后数据更新完成');
            console.log('selectedItem:', this.data.selectedItem);
            console.log('likedPhotoIds:', this.data.likedPhotoIds);
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
  cancelLikePhoto(photoId) {
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
          const approvedPhotos = this.data.approvedPhotos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                isLiked: false,
                likes: Math.max(0, (photo.likes || 0) - 1) // 确保不会小于0
              };
            }
            return photo;
          });

          // 更新分组照片中的点赞数
          const groupedPhotos = { ...this.data.groupedPhotos };
          for (const style in groupedPhotos) {
            groupedPhotos[style] = groupedPhotos[style].map(photo => {
              if (photo._id === photoId) {
                return {
                  ...photo,
                  isLiked: false,
                  likes: Math.max(0, (photo.likes || 0) - 1) // 确保不会小于0
                };
              }
              return photo;
            });
          }

          // 从已点赞列表中移除照片ID
          const likedPhotoIds = this.data.likedPhotoIds.filter(id => id !== photoId);

          this.setData({
            approvedPhotos: approvedPhotos,
            groupedPhotos: groupedPhotos,
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
    wx.previewImage({
      urls: [imageUrl]
    });
  },

  // 查看风格图片集
  viewStylePhotos(e) {
    const images = e.currentTarget.dataset.images;
    wx.previewImage({
      urls: images
    });
  },



  // 显示弹窗
  showModal(e) {
    const index = e.currentTarget.dataset.index;
    const item = this.data.rankingList[index];
    console.log('likedPhotoIds.includes(selectedItem._id)', this.data.likedPhotoIds.includes(item._id));

    // 更新选中项的排名信息
    const updatedItem = {
      ...item,
      isLiked: this.data.likedPhotoIds.includes(item._id),
      rank: index + 1
    };
    this.setData({ selectedItem: updatedItem });

    this.setData({
      showModal: true
      // selectedItem: updatedItem
    });
  },

  // 隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false,
      selectedItem: null
    });
  },

  // 点赞功能（弹窗内）
  likePhotoInModal(e) {
    const photoId = this.data.selectedItem._id;

    // 检查是否已经点赞过
    if (this.data.likedPhotoIds.includes(photoId)) {
      // 如果已经点赞，则取消点赞
      console.log('已点赞，执行取消点赞操作');
      this.cancelLikePhotoInModal();
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
          console.log('云端点赞成功');

          // 更新前端显示的点赞数
          const LIST = this.data.rankingList.map(item => {
            if (item._id === photoId) {
              return {
                ...item,
                isLiked: true,
                likes: (item.likes || 0) + 1
              };
            }
            return item;
          });
          let rankingList = LIST.sort((a, b) => b.likes - a.likes);

          // 更新selectedItem中的点赞数
          const selectedItem = {
            ...this.data.selectedItem,
            isLiked: true,
            likes: (this.data.selectedItem.likes || 0) + 1
          };

          // 更新approvedPhotos中的点赞数
          const approvedPhotos = this.data.approvedPhotos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                isLiked: true,
                likes: (photo.likes || 0) + 1
              };
            }
            return photo;
          });

          // 更新分组照片中的点赞数
          const groupedPhotos = { ...this.data.groupedPhotos };
          for (const style in groupedPhotos) {
            groupedPhotos[style] = groupedPhotos[style].map(photo => {
              if (photo._id === photoId) {
                return {
                  ...photo,
                  isLiked: true,
                  likes: (photo.likes || 0) + 1
                };
              }
              return photo;
            });
          }

          // 将照片ID添加到已点赞列表中
          const likedPhotoIds = [...this.data.likedPhotoIds, photoId];

          console.log('更新后的likedPhotoIds:', likedPhotoIds);
          this.setData({ likedPhotoIds: likedPhotoIds });

          this.setData({
            rankingList: rankingList,
            selectedItem: selectedItem,
            approvedPhotos: approvedPhotos,
            groupedPhotos: groupedPhotos,
            // likedPhotoIds: likedPhotoIds
          }, () => {
            // 数据更新完成后的回调
            console.log('点赞后数据更新完成');
            console.log('selectedItem:', this.data.selectedItem);
            console.log('likedPhotoIds:', this.data.likedPhotoIds);
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

  // 取消点赞功能（弹窗内）
  cancelLikePhotoInModal() {
    const photoId = this.data.selectedItem._id;

    console.log('执行取消点赞操作，photoId:', photoId);
    console.log('当前likedPhotoIds:', this.data.likedPhotoIds);

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
          console.log('云端取消点赞成功');

          // 更新前端显示的点赞数
          const LIST = this.data.rankingList.map(item => {
            if (item._id === photoId) {
              return {
                ...item,
                isLiked: false,
                likes: Math.max(0, (item.likes || 0) - 1) // 确保不会小于0
              };
            }
            return item;
          });
          let rankingList = LIST.sort((a, b) => b.likes - a.likes);

          // 更新selectedItem中的点赞数
          const selectedItem = {
            ...this.data.selectedItem,
            isLiked: false,
            likes: Math.max(0, (this.data.selectedItem.likes || 0) - 1) // 确保不会小于0
          };

          // 更新approvedPhotos中的点赞数
          const approvedPhotos = this.data.approvedPhotos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                likes: Math.max(0, (photo.likes || 0) - 1) // 确保不会小于0
              };
            }
            return photo;
          });

          // 更新分组照片中的点赞数
          const groupedPhotos = { ...this.data.groupedPhotos };
          for (const style in groupedPhotos) {
            groupedPhotos[style] = groupedPhotos[style].map(photo => {
              if (photo._id === photoId) {
                return {
                  ...photo,
                  isLiked: false,
                  likes: Math.max(0, (photo.likes || 0) - 1) // 确保不会小于0
                };
              }
              return photo;
            });
          }

          // 从已点赞列表中移除照片ID
          const likedPhotoIds = this.data.likedPhotoIds.filter(id => id !== photoId);

          console.log('更新后的likedPhotoIds:', likedPhotoIds);

          this.setData({
            rankingList: rankingList,
            selectedItem: selectedItem,
            approvedPhotos: approvedPhotos,
            groupedPhotos: groupedPhotos,
            likedPhotoIds: likedPhotoIds
          }, () => {
            // 数据更新完成后的回调
            console.log('取消点赞后数据更新完成');
            console.log('selectedItem:', this.data.selectedItem);
            console.log('likedPhotoIds:', this.data.likedPhotoIds);
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

  // 查看大图（弹窗内）
  viewPhotoInModal() {
    const imageUrl = this.data.selectedItem.imageUrl;
    wx.previewImage({
      urls: [imageUrl],
      current: imageUrl
    });
  },

  // 阻止事件冒泡
  preventTap(e) {
    console.log('阻止事件冒泡');
  }
});
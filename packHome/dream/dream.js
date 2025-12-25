// packHome/dream/dream.js
const timeUtils = require('../../utils/timeUtils.js');
Page({
  data: {
    activeTab: 'ranking', // 默认显示排行榜
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

  },
  onPageScroll: function (e) {
    // 空实现，但必须保留以便自定义导航栏组件可以绑定滚动事件
    // 实际的滚动处理由custom-navbar组件完成
  },

  onLoad(options) {

    // 加载审核通过的照片
    this.loadApprovedPhotos();

    // 加载排行榜数据
    this.loadRankingList();



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
    // 更新选中项的排名信息
    const updatedItem = {
      ...item,
      rank: index + 1
    };
    this.setData({ selectedItem: updatedItem });

    // 记录浏览记录
    this.recordView(item._id);

    this.setData({
      showModal: true
      // selectedItem: updatedItem
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

          // 更新排行榜中的浏览数
          const updatedRankingList = this.data.rankingList.map(item => {
            if (item._id === photoId) {
              return {
                ...item,
                views: (item.views || 0) + 1
              };
            }
            return item;
          });

          // 更新分组照片中的浏览数
          const updatedGroupedPhotos = { ...this.data.groupedPhotos };
          for (const style in updatedGroupedPhotos) {
            updatedGroupedPhotos[style] = updatedGroupedPhotos[style].map(photo => {
              if (photo._id === photoId) {
                return {
                  ...photo,
                  views: (photo.views || 0) + 1
                };
              }
              return photo;
            });
          }

          // 更新审核通过的照片列表中的浏览数
          const updatedApprovedPhotos = this.data.approvedPhotos.map(photo => {
            if (photo._id === photoId) {
              return {
                ...photo,
                views: (photo.views || 0) + 1
              };
            }
            return photo;
          });

          this.setData({
            rankingList: updatedRankingList,
            groupedPhotos: updatedGroupedPhotos,
            approvedPhotos: updatedApprovedPhotos
          });
        },
        fail: err => {
          console.error('浏览记录失败:', err);
        }
      });
    }
  },

  // 隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false,
      selectedItem: null
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
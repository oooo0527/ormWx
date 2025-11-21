// components/support/support.js
Component({
  properties: {

  },

  data: {
    supportList: [
      {
        id: '321432',
        title: "Orm生日应援活动",
        coverImage: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/CN/2025.5曼谷生日/IMG_1538.JPG",
        tiime: "202505",
        year: "2025",
        address: "曼谷",
        img: [
          ".jnsxjbkh"
        ]
      }
    ]
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.loadSupportList();
    }
  },

  methods: {
    // 加载应援列表
    loadSupportList: function () {
      // 从云函数获取数据
      wx.cloud.callFunction({
        name: 'fanVoice',
        data: {
          action: 'getSupportImages'
        }
      }).then(res => {
        if (res.result.success) {
          this.setData({
            supportList: res.result.data
          });
        } else {
          wx.showToast({
            title: res.result.message,
            icon: 'none'
          });
        }
      }).catch(err => {
        console.error('获取应援列表失败', err);
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      });
    },

    // 跳转到详情页
    goToDetail: function (e) {
      const id = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: '/pages/support-detail/detail'
      });
    }
  }
})
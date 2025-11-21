// components/fanVoiceContent/fanVoiceContent.js
Component({
  properties: {
    currentCategory: {
      type: String,
      value: 'interaction'
    },
    supportData: {
      type: Object,
      value: {}
    }
  },

  data: {
    // 中国应援详情数据
    supportDetail: null,
    // 是否显示详情页
    showDetail: false
  },

  methods: {
    // 处理导航到详情页事件
    navigateToDetail: function (e) {
      const id = e.detail.id;
      // 这里应该根据id获取详情数据
      // 模拟获取详情数据
      const detail = {
        id: id,
        title: "Orm生日应援活动",
        description: "中国粉丝为Orm举办的2025年生日应援活动，包含视频、图片等多种形式的祝福",
        coverImage: "/images/default_avatar.png",
        date: "202505",
        year: "2025",
        location: "曼谷",
        images: [
          "/images/default_avatar.png",
          "/images/default_avatar.png",
          "/images/default_avatar.png"
        ]
      };

      this.setData({
        supportDetail: detail,
        showDetail: true
      });
    },

    // 返回列表页
    backToList: function () {
      this.setData({
        showDetail: false
      });
    }
  }
})
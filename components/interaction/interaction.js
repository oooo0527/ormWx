// components/interaction/interaction.js
Component({
  properties: {

  },

  data: {
    voices: []
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.loadVoices();
    }
  },

  methods: {
    // 加载心声列表
    loadVoices: function () {
      // 模拟从接口获取数据
      const voices = [
        {
          id: 1,
          content: "ORM：我想拥有隐形的能力，这样我就可以偷偷出去玩而不被人发现（笑）。",
          context: "ELLE杂志采访中关于超能力的提问",
          type: "幽默自白",
          category: "interaction",
          userId: "user1",
          likes: [],
          comments: [],
          createTime: "2025-01-15 10:30",
          updateTime: "2025-01-15 10:30"
        },
        {
          id: 2,
          content: "我是一个特别容易入睡的人...在片场，有三个发型师围着我忙...我却能在这样的环境里睡着。所以有很多'数字足迹'（笑），因为大家会偷拍我睡觉。",
          context: "ELLE杂志采访中分享的片场趣事",
          type: "可爱日常",
          category: "interaction",
          userId: "user2",
          likes: [],
          comments: [],
          createTime: "2025-01-10 14:20",
          updateTime: "2025-01-10 14:20"
        },
        {
          id: 10,
          content: "大家一起在评论区聊聊Orm最近的作品吧！",
          context: "互动话题",
          type: "互动讨论",
          category: "interaction",
          userId: "user10",
          likes: [],
          comments: [],
          createTime: "2025-01-22 14:20",
          updateTime: "2025-01-22 14:20"
        }
      ];

      this.setData({
        voices: voices
      });
    },

    // 点赞心声
    likeVoice: function (e) {
      wx.showModal({
        title: '提示',
        content: '请先登录以使用点赞功能',
        showCancel: false,
        confirmText: '知道了'
      });
    },

    // 评论心声
    commentVoice: function (e) {
      wx.showModal({
        title: '提示',
        content: '请先登录以使用评论功能',
        showCancel: false,
        confirmText: '知道了'
      });
    }
  }
})
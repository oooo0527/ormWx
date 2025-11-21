// mom.js
Page({
  data: {
    voices: [
      {
        id: 5,
        content: "Orm在《猎恶游戏》中饰演被冷漠抛弃的黑手党千金'Anya'而为人熟知。",
        context: "代表角色获得关注",
        type: "演技肯定",
        category: "mom",
        userId: "user5",
        likes: [],
        comments: [],
        createTime: "2024-12-20 11:30",
        updateTime: "2024-12-20 11:30"
      },
      {
        id: 8,
        content: "作为妈粉，看到Orm在采访中提到家庭就很温暖。",
        context: "Orm家庭观念分享",
        type: "妈粉心声",
        category: "mom",
        userId: "user8",
        likes: [],
        comments: [],
        createTime: "2025-01-20 15:30",
        updateTime: "2025-01-20 15:30"
      },
      {
        id: 12,
        content: "作为妈粉，真的被Orm的孝顺感动到了！",
        context: "Orm家庭互动分享",
        type: "妈粉感言",
        category: "mom",
        userId: "user12",
        likes: [],
        comments: [],
        createTime: "2025-01-19 11:45",
        updateTime: "2025-01-19 11:45"
      }
    ]
  },

  onLoad: function (options) {

  },

  onShow: function () {

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
})
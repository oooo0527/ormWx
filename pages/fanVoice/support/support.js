// support.js
Page({
  data: {
    voices: [
      {
        id: 3,
        content: "如果我能回去和小时候的小Norawan对话，我会告诉她'你所做的一切都是对的'...我从来不是那种固执到会造成生活中重大问题的人。爸爸妈妈教了我很多东西，让我内心变得非常充实。",
        context: "ELLE杂志采访中回顾成长的感悟",
        type: "积极人生观",
        category: "support",
        userId: "user3",
        likes: [],
        comments: [],
        createTime: "2025-01-05 09:15",
        updateTime: "2025-01-05 09:15"
      },
      {
        id: 4,
        content: "她以亮眼的表现，首次登上ELLE Thailand 2025年1月刊封面",
        context: "时尚杂志对其专业表现力的认可",
        type: "专业认可",
        category: "support",
        userId: "user4",
        likes: [],
        comments: [],
        createTime: "2024-12-28 16:45",
        updateTime: "2024-12-28 16:45"
      },
      {
        id: 7,
        content: "中国粉丝们为Orm举办的生日应援活动太让人感动了！",
        context: "2025年Orm生日应援活动",
        type: "应援活动",
        category: "support",
        userId: "user7",
        likes: [],
        comments: [],
        createTime: "2025-05-27 10:00",
        updateTime: "2025-05-27 10:00"
      },
      {
        id: 11,
        content: "中国粉丝为Orm制作的应援视频太棒了！",
        context: "中国粉丝应援作品",
        type: "应援展示",
        category: "support",
        userId: "user11",
        likes: [],
        comments: [],
        createTime: "2025-01-21 16:30",
        updateTime: "2025-01-21 16:30"
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
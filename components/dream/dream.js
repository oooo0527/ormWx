// components/dream/dream.js
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
          "id": 6,
          "content": "Orm在《我们的秘密》中的表现太迷人了，每一个眼神都让人心动不已。",
          "context": "作品角色分析",
          "type": "角色魅力",
          "category": "dream",
          "userId": "user6",
          "likes": [],
          "comments": [],
          "createTime": "2025-01-20 11:30",
          "updateTime": "2025-01-20 11:30"
        },
        {
          "id": 7,
          "content": "如果能和Orm在樱花飞舞的季节里一起散步，那该是多么浪漫的事情啊。",
          "context": "幻想场景",
          "type": "浪漫幻想",
          "category": "dream",
          "userId": "user7",
          "likes": [],
          "comments": [],
          "createTime": "2025-01-18 14:20",
          "updateTime": "2025-01-18 14:20"
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
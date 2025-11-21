// components/mom/mom.js
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
          "id": 4,
          "content": "Orm就像我的孩子一样，看着他从青涩的新人成长为现在这样优秀的演员，真的很欣慰。",
          "context": "妈粉心声",
          "type": "温暖寄语",
          "category": "mom",
          "userId": "user4",
          "likes": [],
          "comments": [],
          "createTime": "2025-01-12 09:15",
          "updateTime": "2025-01-12 09:15"
        },
        {
          "id": 5,
          "content": "希望Orm在追求事业的同时也要注意身体，不要太过劳累。你永远是妈妈们最疼爱的孩子。",
          "context": "关心Orm健康",
          "type": "暖心关怀",
          "category": "mom",
          "userId": "user5",
          "likes": [],
          "comments": [],
          "createTime": "2025-01-08 16:40",
          "updateTime": "2025-01-08 16:40"
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
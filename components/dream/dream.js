// components/dream/dream.js
Component({
  properties: {

  },

  data: {
    voices: [],
    droplets: [] // 存储水滴图片数据
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.loadVoices();
      this.initDroplets();
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

    // 初始化水滴图片
    initDroplets: function () {
      // 模拟一些水滴图片数据
      const droplets = [];
      // 创建15个水滴
      for (let i = 0; i < 15; i++) {
        droplets.push({
          id: i,
          src: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/d554005a153ae86aa6b8de351230cbf6.jpg', // 这里应该替换为实际的图片路径
          x: Math.random() * 100, // 随机水平位置
          y: -10 - Math.random() * 50, // 初始位置在屏幕上方
          size: 15 + Math.random() * 35, // 随机大小
          speed: 0.5 + Math.random() * 2, // 随机下落速度
          scale: 0.5 + Math.random() * 0.5, // 初始缩放比例
          rotation: Math.random() * 360 // 随机旋转角度
        });
      }

      this.setData({
        droplets: droplets
      });

      // 开始动画
      this.animateDroplets();
    },

    // 水滴动画
    animateDroplets: function () {
      const droplets = this.data.droplets;
      let needUpdate = false;

      for (let i = 0; i < droplets.length; i++) {
        // 更新水滴位置
        droplets[i].y += droplets[i].speed;
        // 更新水滴大小（逐渐变大）
        droplets[i].scale += 0.005;
        // 更新旋转角度
        droplets[i].rotation += 0.5;

        // 如果水滴落出屏幕底部，重置到顶部
        if (droplets[i].y > 120) {
          droplets[i].y = -10 - Math.random() * 50;
          droplets[i].x = Math.random() * 100;
          droplets[i].scale = 0.5 + Math.random() * 0.5;
          droplets[i].rotation = Math.random() * 360;
        }

        needUpdate = true;
      }

      if (needUpdate) {
        this.setData({
          droplets: droplets
        });

        // 继续动画
        setTimeout(() => {
          this.animateDroplets();
        }, 50);
      }
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
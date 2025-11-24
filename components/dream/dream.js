// components/dream/dream.js
Component({
  properties: {

  },

  data: {
    voices: [],
    tunnelImages: [], // 存储时光隧道图片数据
    swiperList: [
      {
        id: 1,
        type: 'image',
        url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/dream/4659bde233dbb23bea1fcaede40190c3.jpg'
      },
      {
        id: 2,
        type: 'image',
        url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/dream/476361aea0c50a83e749dde0491984c1.jpg'
      },
      {
        id: 3,
        type: 'image',
        url: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/dream/7209ebae7e26aec743643d3fac3c162a.jpg'
      }
    ],
    currentSwiperIndex: 0 // 当前轮播图索引
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.initTunnelImages();
    }
  },

  methods: {

    // 初始化时光隧道图片
    initTunnelImages: function () {
      // 使用轮播图数据作为时光隧道图片
      const tunnelImages = [];
      const swiperList = this.data.swiperList;

      // 创建20个隧道图片元素
      for (let i = 0; i < 20; i++) {
        const imgIndex = i % swiperList.length;
        tunnelImages.push({
          id: i,
          src: swiperList[imgIndex].url,
          x: Math.random() * 100, // 随机水平位置
          y: 50, // 初始位置在屏幕中间
          z: i * 50, // z轴位置
          scale: 0.2 + Math.random() * 0.2, // 初始缩放比例
          opacity: 0.3 + Math.random() * 0.4, // 初始透明度
          speed: 0.5 + Math.random() * 0.5 // 移动速度
        });
      }

      this.setData({
        tunnelImages: tunnelImages
      });

      // 开始时光隧道动画
      this.animateTunnel();
    },

    // 时光隧道动画
    animateTunnel: function () {
      const tunnelImages = this.data.tunnelImages;
      let needUpdate = false;

      for (let i = 0; i < tunnelImages.length; i++) {
        // 更新图片位置
        tunnelImages[i].z += tunnelImages[i].speed;
        // 更新缩放比例
        tunnelImages[i].scale = 0.2 + (tunnelImages[i].z / 1000);
        // 更新透明度
        tunnelImages[i].opacity = Math.min(1, tunnelImages[i].z / 500);
        // 更新垂直位置，创建流动效果
        tunnelImages[i].y = 50 + Math.sin(tunnelImages[i].z / 50) * 20;

        // 如果图片移出屏幕，重置到远处
        if (tunnelImages[i].z > 1000) {
          tunnelImages[i].z = -200 - Math.random() * 100;
          tunnelImages[i].x = Math.random() * 100;
          tunnelImages[i].scale = 0.2 + Math.random() * 0.3;
          tunnelImages[i].opacity = 0.3 + Math.random() * 0.4;
        }

        needUpdate = true;
      }

      if (needUpdate) {
        this.setData({
          tunnelImages: tunnelImages
        });

        // 继续动画
        setTimeout(() => {
          this.animateTunnel();
        }, 30);
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
    },

    // 轮播图切换事件
    onSwiperChange: function (e) {
      this.setData({
        currentSwiperIndex: e.detail.current
      });
    }
  }
})
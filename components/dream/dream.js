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

      // 创建30个隧道图片元素，增加图片数量使显示更完整
      for (let i = 0; i < 30; i++) {
        const imgIndex = i % swiperList.length;

        // 随机选择一个起始边缘：0-左边缘，1-右边缘，2-上边缘，3-下边缘
        const startEdge = Math.floor(Math.random() * 4);
        let startX, startY;

        switch (startEdge) {
          case 0: // 左边缘
            startX = -20;
            startY = Math.random() * 100;
            break;
          case 1: // 右边缘
            startX = 120;
            startY = Math.random() * 100;
            break;
          case 2: // 上边缘
            startX = Math.random() * 120;
            startY = -20;
            break;
          case 3: // 下边缘
            startX = Math.random() * 120;
            startY = 120;
            break;
        }

        // 随机生成移动速度
        const xSpeed = (Math.random() - 0.5) * 2; // 水平速度：-1到1之间
        const ySpeed = (Math.random() - 0.5) * 2; // 垂直速度：-1到1之间
        const zSpeed = 0.5 + Math.random() * 0.5; // z轴速度保持正值

        tunnelImages.push({
          id: i,
          src: swiperList[imgIndex].url,
          x: startX,
          y: startY,
          z: 0, // 初始z轴位置设为0
          xSpeed: xSpeed,
          ySpeed: ySpeed,
          zSpeed: zSpeed,
          scale: 0.2 + Math.random() * 0.1, // 初始缩放比例，更小的起始尺寸
          opacity: 0.5 + Math.random() * 0.2, // 初始透明度
          maxScale: 0.8 + Math.random() * 0.3, // 最大缩放比例
          minScale: 0.5 + Math.random() * 0.1, // 最小缩放比例
          scaleSpeed: 0.005 + Math.random() * 0.005, // 缩放速度
          scaleDirection: 1 // 缩放方向，1为放大，-1为缩小
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
        tunnelImages[i].x += tunnelImages[i].xSpeed;
        tunnelImages[i].y += tunnelImages[i].ySpeed;
        tunnelImages[i].z += tunnelImages[i].zSpeed;

        // 实现先放大后缩小的效果
        if (tunnelImages[i].scaleDirection === 1) {
          // 放大阶段
          tunnelImages[i].scale += tunnelImages[i].scaleSpeed;
          if (tunnelImages[i].scale >= tunnelImages[i].maxScale) {
            tunnelImages[i].scaleDirection = -1; // 开始缩小
          }
        } else {
          // 缩小阶段
          tunnelImages[i].scale -= tunnelImages[i].scaleSpeed;
          if (tunnelImages[i].scale <= tunnelImages[i].minScale) {
            tunnelImages[i].scaleDirection = 1; // 开始放大
          }
        }

        // 更新透明度，距离越远越透明
        tunnelImages[i].opacity = Math.min(1, Math.max(0.8, tunnelImages[i].z / 800));

        // 如果图片移出屏幕，重置到边缘外的随机位置
        if (tunnelImages[i].z > 1200 ||
          tunnelImages[i].x < -50 || tunnelImages[i].x > 150 ||
          tunnelImages[i].y < -50 || tunnelImages[i].y > 150) {

          // 随机选择一个起始边缘
          const startEdge = Math.floor(Math.random() * 4);
          switch (startEdge) {
            case 0: // 左边缘
              tunnelImages[i].x = -20;
              tunnelImages[i].y = Math.random() * 100;
              break;
            case 1: // 右边缘
              tunnelImages[i].x = 120;
              tunnelImages[i].y = Math.random() * 100;
              break;
            case 2: // 上边缘
              tunnelImages[i].x = Math.random() * 120;
              tunnelImages[i].y = -20;
              break;
            case 3: // 下边缘
              tunnelImages[i].x = Math.random() * 120;
              tunnelImages[i].y = 120;
              break;
          }

          tunnelImages[i].z = 0; // 重置z轴位置
          tunnelImages[i].scale = 0.2 + Math.random() * 0.1;
          tunnelImages[i].opacity = 0.8 + Math.random() * 0.2;
          tunnelImages[i].scaleDirection = 1; // 重置缩放方向为放大
          tunnelImages[i].maxScale = 0.8 + Math.random() * 0.3;
          tunnelImages[i].minScale = 0.5 + Math.random() * 0.1;
          tunnelImages[i].scaleSpeed = 0.005 + Math.random() * 0.005; // 重置缩放速度

          // 重新设置移动速度
          tunnelImages[i].xSpeed = (Math.random() - 0.5) * 2;
          tunnelImages[i].ySpeed = (Math.random() - 0.5) * 2;
          tunnelImages[i].zSpeed = 0.5 + Math.random() * 0.5;
        }

        needUpdate = true;
      }

      if (needUpdate) {
        this.setData({
          tunnelImages: tunnelImages
        });

        // 继续动画，延长动画帧间隔时间
        setTimeout(() => {
          this.animateTunnel();
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
    },

    // 轮播图切换事件
    onSwiperChange: function (e) {
      this.setData({
        currentSwiperIndex: e.detail.current
      });
    }
  }
})
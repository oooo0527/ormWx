
Page({
  data: {
    currentDate: '',
    // 图标数组
    icons: [
      '/images/icon_star.png',
      '/images/icon_data.png',
      '/images/icon_work.png',
      '/images/icon_fan.png',
      '/images/icon_my.png'
    ],
    showNumberContainer: false,
    // 当前显示的图标索引
    currentIconIndex: 0,
    // 当前显示的图标
    currentIcon: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/lip.png',
    // 用于显示的图片数组
    displayImages: [
      'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/orm.png'
    ],
    displayImage1: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/login-bg.jpg',
    showHome: true,
    // 当前显示的图片索引
    currentDisplayIndex: 0,
    // 当前显示的图片
    displayImage: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/lip.png',
    displayImage2: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/under.png',
    // 图标位置
    iconLeft: 150,
    iconTop: '100vh',
    // 拖动相关数据
    startPoint: null,
    numberList: [2, 5, 7, 0],
    // 四个数字框的值，初始为0
    numbers: [0, 0, 0, 0],
    Clickindex: 0,
    fullText: ['cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/382d1b35bd8ace665ce707f7187e62cf.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/417858952cd59a30b0595a02af6b79a1.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/5226b16fd4d1fafeadd68195d1e67b4d.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/694a01d85f65060bcfe5b31c2fedcd43.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/78e2188c61934fa869136726110523b6.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/8a2083f70fd31b453710751e9de060da.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/adbdd025012274757d315130e0e05c08.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/b55eafaa6e5527a63fe9be0056fcb0d6.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/e292e8fa69e5eb10d19afbc18820ccab.jpg', 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/FC/e292e8fa69e5eb10d19afbc18820ccab.jpg'],
    textIndex: 0,
    timer: null,
    // 用于跟踪图片点击顺序
    clickSequence: [],
    targetSequence: [9, 4, 1, 6], // 目标点击顺序
    // 点击动画状态
    clickAnimation: [],
    // 时间相关数据
    currentTime: new Date(),
    hours: 0, // 将在onLoad中初始化为当前小时
    minutes: 0, // 将在onLoad中初始化为当前分钟
    hourDeg: 0, // 将在onLoad中初始化
    minuteDeg: 0, // 将在onLoad中初始化
    clockCenter: { x: 0, y: 0 }, // 表盘中心坐标
    isDragging: false, // 是否正在拖拽
    showIcon: false,


  },

  onLoad: function () {
    // 1. 检查隐私协议（核心步骤）
    this.checkPrivacySetting();
    // 页面加载时的逻辑
    // 获取当前时间并设置小时和分钟
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // 更新数据
    this.setData({
      hours: hours,
      minutes: minutes
    });

    // 计算指针角度
    this.calculateHandAngles();
    this.initVoicePlayer()
    // 设置新的音频源
    this.voicePlayer.src = 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/陈奥三万天音频.mp3'
  },
  onReady: function () {
    // 页面渲染完成后获取表盘中心位置
    const that = this;
    // 延迟一段时间确保元素已经渲染
    setTimeout(() => {
      wx.createSelectorQuery()
        .select('.clock-face')
        .boundingClientRect(function (rect) {
          if (rect) {
            that.setData({
              clockCenter: {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
              }
            });
          } else {
            // 如果无法获取clock-face元素，尝试使用默认值
            wx.getSystemInfo({
              success: function (res) {
                that.setData({
                  clockCenter: {
                    x: res.windowWidth / 2,
                    y: 160 + 20 // 大概在页面顶部的位置
                  }
                });
              }
            });
          }
        })
        .exec();
    }, 500); // 延迟500ms确保渲染完成
  },
  checkPrivacySetting() {
    console.log('检查隐私协议');
    // 调用官方API获取隐私授权状态
    wx.getPrivacySetting({
      success: (res) => {
        /* 
          res 对象包含：
          - needAuthorization: Boolean，是否需要弹窗授权
          - privacyContractName: String，隐私协议名称
        */
        console.log('隐私协议状态:', res);
        // 如果平台要求授权，则弹出官方协议
        if (res.needAuthorization) {
          // 这是微信官方弹窗，样式不可自定义
          wx.requirePrivacyAuthorization({
            success: () => {
              console.log('用户同意了基础隐私协议');
              // 用户同意后，可以正常使用小程序
            },
            fail: () => {
              console.log('用户拒绝了基础隐私协议');
              // 可考虑提示用户或限制部分功能
              wx.showToast({
                title: '需要同意协议才能使用完整功能',
                icon: 'none'
              });
            }
          });
        } else {
          console.log('无需额外隐私授权');
        }
      },
      fail: (err) => {
        console.error('获取隐私设置失败:', err);
      }
    });
  },

  // 计算时针和分针的角度
  calculateHandAngles: function () {
    // 时针角度：每小时30度 + 每分钟0.5度
    const hourDeg = (this.data.hours % 12) * 30 + this.data.minutes * 0.5;
    // 分针角度：每分钟6度
    const minuteDeg = this.data.minutes * 6;

    this.setData({
      hourDeg: hourDeg + 180,
      minuteDeg: minuteDeg + 180
    });
  },

  // 触摸开始事件
  onTouchStart: function (e) {
    this.setData({
      isDragging: true
    });

    // 确保表盘中心点已设置
    if (this.data.clockCenter.x === 0 && this.data.clockCenter.y === 0) {
      const that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            clockCenter: {
              x: res.windowWidth / 2,
              y: 180 // 大概在页面顶部的位置
            }
          });
        }
      });
    }
  },

  // 触摸移动事件
  onTouchMove: function (e) {
    if (!this.data.isDragging) return;

    const touch = e.touches[0];
    const centerX = this.data.clockCenter.x;
    const centerY = this.data.clockCenter.y;

    // 计算触摸点与中心点的相对位置
    const deltaX = touch.clientX - centerX;
    const deltaY = touch.clientY - centerY;

    // 计算角度（以12点为0度，顺时针增加）
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

    // 调整到0-360度范围，12点为0度
    angle = (angle + 90 + 360) % 360;

    // 将角度转换为时间（0-360度 对应 00:00-23:59）
    // 360度 = 24小时 = 1440分钟
    const totalMinutes = Math.round((angle / 360) * 1440);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;

    // 更新时间和指针角度
    this.setData({
      hours: hours,
      minutes: minutes
    });
    if (hours == 5 && minutes == 27) {
      this.setData({
        showIcon: true
      });
    }

    // 重新计算指针角度
    this.calculateHandAngles();
  },

  // 触摸结束事件
  onTouchEnd: function (e) {
    this.setData({
      isDragging: false
    });
  },
  // 初始化语音播放器
  initVoicePlayer: function () {
    // 创建内部音频上下文
    this.voicePlayer = wx.createInnerAudioContext();

    this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
  },
  goHome: function () {
    // 获取app实例
    const app = getApp();
    wx.showLoading({
      title: '进入中...',
    });
    wx.cloud.callFunction({
      name: 'imageConfig',
      data: {
        action: 'getImageConfig',
        configType: 'ormkornnaphat',
        configName: 'ormkornnaphat'
      }
    }).then(res => {
      console.log(res, 'getImageConfig')
      if (res.result.success && res.result.data.length > 0) {
        // 设置全局数据
        app.globalData.ormkornnaphat = res.result.data[0];

      } else {
        wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
      }
    });
    // 跳转到首页
    wx.switchTab({
      url: '/pages/Home/Home'
    });
  },


  switchZindex: function () {

    console.log('switchZindex function called');
    // 监听音频结束
    this.voicePlayer.onEnded(() => {
      console.log('音频结束');
      this.voicePlayer.stop();
      // wx.switchTab({
      //   url: '/pages/Home/Home'
      // });
      // this.setData({
      //   showNumberContainer: true
      // });
    });


  },

  // 页面卸载时清除定时器
  onUnload: function () {
    if (this.data.timer) {
      clearInterval(this.data.timer);
    }
  },


  // 长按切换显示图片
  switchDisplayImage: function () {
    // 切换显示图片
    const nextDisplayIndex = (this.data.currentDisplayIndex + 1) % this.data.displayImages.length;
    const nextDisplayImage = this.data.displayImages[nextDisplayIndex];

    // 更新数据
    this.setData({
      currentDisplayIndex: nextDisplayIndex,
      displayImage: nextDisplayImage,
      showHome: false,
      displayImage1: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/login/have-to.jpg',
    });
    this.voicePlayer.play();
  },

  // 数字框点击增加事件
  incrementNumber: function (e) {

    const Clickindex = this.data.Clickindex;
    const numbers = this.data.numbers;
    numbers[Clickindex] = e.currentTarget.dataset.index;
    this.setData({
      numbers: numbers,
      Clickindex: Clickindex + 1
    });
    if (numbers[0] == 0 && numbers[1] == 5 && numbers[2] == 2 && numbers[3] == 7) {
      wx.switchTab({
        url: '/pages/Home/Home'
      });
    }
    else {
      if (this.data.Clickindex >= 4) {
        wx.showToast({
          title: '这密码很难吗？',
          duration: 1000
        });
        this.setData({
          Clickindex: 0
        });
      }
    }
  },

  // 图片点击事件处理函数
  onTextImageClick: function (e) {
    const clickedIndex = e.currentTarget.dataset.index;
    console.log('点击了图片索引:', clickedIndex);

    // 触发点击动画
    this.triggerClickAnimation(clickedIndex);

    // 将点击的索引添加到点击序列中
    const newClickSequence = [...this.data.clickSequence, parseInt(clickedIndex)];

    this.setData({
      clickSequence: newClickSequence
    });

    console.log('当前点击序列:', newClickSequence);

    // 检查是否与目标序列匹配
    const targetSequence = this.data.targetSequence;

    // 如果当前点击序列长度超过目标序列，重置
    if (newClickSequence.length > targetSequence.length) {
      this.setData({
        clickSequence: [parseInt(clickedIndex)]
      });
      console.log('序列重置，当前点击:', clickedIndex);
      return;
    }

    // 检查当前序列是否与目标序列的前几位匹配
    let isMatch = true;
    for (let i = 0; i < newClickSequence.length; i++) {
      if (newClickSequence[i] !== targetSequence[i]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      // 如果完全匹配目标序列，跳转到Home页面
      if (newClickSequence.length === targetSequence.length) {
        console.log('成功匹配目标序列，跳转到Home页面');
        wx.switchTab({
          url: '/pages/Home/Home'
        });

        // 重置点击序列
        this.setData({
          clickSequence: []
        });
      }
    } else {
      // 如果不匹配，重置点击序列并从当前点击开始
      this.setData({
        clickSequence: [parseInt(clickedIndex)]
      });
      console.log('序列不匹配，重置并从当前点击开始:', clickedIndex);
    }
  },

  // 触发点击动画
  triggerClickAnimation: function (index) {
    // 创建动画数组副本
    let newClickAnimation = [...this.data.clickAnimation];

    // 确保数组长度足够
    while (newClickAnimation.length <= index) {
      newClickAnimation.push(false);
    }

    // 设置当前索引为true，触发动画
    newClickAnimation[index] = true;

    this.setData({
      clickAnimation: newClickAnimation
    });

    // 500毫秒后移除动画类
    setTimeout(() => {
      let resetClickAnimation = [...this.data.clickAnimation];
      if (resetClickAnimation.length > index) {
        resetClickAnimation[index] = false;
      }

      this.setData({
        clickAnimation: resetClickAnimation
      });
    }, 500);
  }
});
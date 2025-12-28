Page({
  data: {
    // 音乐列表数据
    musicList: [],
    // 当前播放音乐索引
    currentMusicIndex: 0,
    // 音频对象
    audioCtx: null,
    // 播放状态
    isPlaying: false,
    // 当前播放时间
    currentTime: 0,
    // 总时长
    duration: 0,
    // 歌词数组
    lyricArray: [],
    // 当前行歌词索引
    currentLyricIndex: 0,
    // 旋转动画状态
    isRotating: false,
    // 调试模式
    __debug__: true,
    playMoreAn: false
  },

  onLoad: function () {
    // 从云数据库获取音乐数据
    this.getMusicListFromCloud();
  },

  // 从云数据库获取音乐列表
  getMusicListFromCloud: function () {
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getMusicList'
      }
    }).then(res => {
      if (res.result.success) {
        // 更新音乐列表数据
        this.setData({
          musicList: res.result.data
        });
        console.log('获取音乐列表结果:', res.result.data);

        // 初始化音频上下文
        this.initAudioContext();
      } else {
        console.error('获取音乐列表失败:', res.result.message);
        wx.showToast({
          title: '获取音乐列表失败',
          icon: 'none'
        });

        // 使用默认数据
        this.useDefaultMusicList();
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  },

  // 初始化音频上下文
  initAudioContext: function () {
    const audioCtx = wx.createInnerAudioContext();
    this.setData({ audioCtx });

    // 监听音频播放事件
    audioCtx.onPlay(() => {
      console.log('开始播放');
      this.setData({
        isPlaying: true,
        isRotating: true
      });
    });

    // 监听音频暂停事件
    audioCtx.onPause(() => {
      console.log('暂停播放');
      this.setData({
        isPlaying: false,
        isRotating: false
      });
    });

    // 监听音频停止事件
    audioCtx.onStop(() => {
      console.log('停止播放');
      this.setData({
        isPlaying: false,
        currentTime: 0,
        isRotating: false
      });
    });

    // 监听音频播放进度更新事件
    audioCtx.onTimeUpdate(() => {
      const currentTime = audioCtx.currentTime;
      const duration = audioCtx.duration;

      // 更新当前时间和总时长
      this.setData({
        currentTime: currentTime,
        duration: duration
      });
    });

    // 监听音频播放结束事件
    audioCtx.onEnded(() => {
      console.log('播放结束');
      this.setData({
        isPlaying: false,
        currentTime: 0,
        isRotating: false
      });
      // 自动播放下一首
      // this.nextMusic();
    });

    // 监听音频播放错误事件
    audioCtx.onError((res) => {
      console.error('播放错误', res);
      let errorMsg = '播放出错';

      // 根据错误代码提供更具体的错误信息
      switch (res.errCode) {
        case 10001:
          errorMsg = '系统错误';
          break;
        case 10002:
          errorMsg = '网络错误';
          break;
        case 10003:
          errorMsg = '文件错误';
          break;
        case 10004:
          errorMsg = '格式错误';
          break;
        case -1:
          errorMsg = '未知错误';
          break;
        default:
          errorMsg = '播放出错: ' + res.errMsg;
      }

      wx.showToast({
        title: errorMsg,
        icon: 'none'
      });
    });

    // 监听音频可以播放事件
    audioCtx.onCanplay(() => {
      console.log('音频可以播放');
    });

    // 监听音频等待事件
    audioCtx.onWaiting(() => {
      console.log('音频等待中...');
    });

    // 如果有音乐列表，设置第一首歌的音频源
    if (this.data.musicList.length > 0) {
      const currentMusic = this.data.musicList[this.data.currentMusicIndex];
      console.log('设置音频源:', currentMusic.url);
      audioCtx.src = currentMusic.url;
    }
  },

  // 播放/暂停
  togglePlay: function () {
    const audioCtx = this.data.audioCtx;
    if (this.data.isPlaying) {
      audioCtx.pause();
    } else {
      // 强制重置动画状态后再触发动画
      this.setData({
        playMoreAn: false
      });

      // 使用微小延迟确保重置生效
      setTimeout(() => {
        this.setData({
          playMoreAn: true
        });

        // 重置动画状态以便下次触发
        setTimeout(() => {
          this.setData({
            playMoreAn: false
          });
        }, 1200);
      }, 50);

      audioCtx.play();
    }
  },



  // 点击播放更多动画
  playMoreL: function () {
    // 强制重置动画状态后再触发动画
    this.setData({
      playMoreAn: false
    });

    // 使用微小延迟确保重置生效
    setTimeout(() => {
      this.setData({
        playMoreAn: true
      });

      // 重置动画状态以便下次触发
      setTimeout(() => {
        this.setData({
          playMoreAn: false
        });
      }, 1200);
    }, 50);
  },

  // 上一首
  prevMusic: function () {
    let currentIndex = this.data.currentMusicIndex;
    currentIndex = (currentIndex - 1 + this.data.musicList.length) % this.data.musicList.length;

    this.setData({
      currentMusicIndex: currentIndex
    });

    const music = this.data.musicList[currentIndex];

    // 验证音频源
    if (!music || !music.url) {
      wx.showToast({
        title: '音乐资源无效',
        icon: 'none'
      });
      return;
    }

    const audioCtx = this.data.audioCtx;
    audioCtx.src = music.url;

    // 添加一个小延迟确保音频源设置完成
    setTimeout(() => {
      audioCtx.play().catch(err => {
        console.error('播放失败:', err);
        wx.showToast({
          title: '播放失败: ' + err.message,
          icon: 'none'
        });
      });
    }, 100);
  },

  // 下一首
  nextMusic: function () {
    let currentIndex = this.data.currentMusicIndex;
    currentIndex = (currentIndex + 1) % this.data.musicList.length;

    this.setData({
      currentMusicIndex: currentIndex
    });

    const music = this.data.musicList[currentIndex];

    // 验证音频源
    if (!music || !music.url) {
      wx.showToast({
        title: '音乐资源无效',
        icon: 'none'
      });
      return;
    }

    const audioCtx = this.data.audioCtx;
    audioCtx.src = music.url;

    // 添加一个小延迟确保音频源设置完成
    setTimeout(() => {
      audioCtx.play().catch(err => {
        console.error('播放失败:', err);
        wx.showToast({
          title: '播放失败: ' + err.message,
          icon: 'none'
        });
      });
    }, 100);
  },

  // 格式化时间
  formatTime: function (time) {
    if (isNaN(time)) return '00:00';

    const minute = Math.floor(time / 60);
    const second = Math.floor(time % 60);

    return `${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
  },

  // 拖拽进度条
  sliderChange: function (e) {
    const position = e.detail.value;
    const audioCtx = this.data.audioCtx;

    // 跳转到指定位置
    audioCtx.seek(position);

    // 更新当前时间
    this.setData({ currentTime: position });
  },

  // 轮播图切换事件
  onSwiperChange: function (e) {
    const currentIndex = e.detail.current;
    this.setData({ currentMusicIndex: currentIndex });

    // 如果正在播放，则切换音乐
    if (this.data.isPlaying) {
      const music = this.data.musicList[currentIndex];

      // 验证音频源
      if (!music || !music.url) {
        wx.showToast({
          title: '音乐资源无效',
          icon: 'none'
        });
        return;
      }

      const audioCtx = this.data.audioCtx;
      audioCtx.src = music.url;

      // 添加一个小延迟确保音频源设置完成
      setTimeout(() => {
        audioCtx.play().catch(err => {
          console.error('播放失败:', err);
          wx.showToast({
            title: '播放失败: ' + err.message,
            icon: 'none'
          });
        });
      }, 100);
    }
  }
})
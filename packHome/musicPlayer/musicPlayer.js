// packHome/musicPlayer/musicPlayer.js
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
    isRotating: false
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

        // 初始化第一首歌的歌词（如果有的话）
        if (this.data.musicList.length > 0 && this.data.musicList[0].lrc) {
          this.parseLyric(this.data.musicList[0].lrc);
        }
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

      // 使用默认数据
      this.useDefaultMusicList();
    });
  },

  // 使用默认音乐列表
  useDefaultMusicList: function () {
    const defaultMusicList = [
      {
        id: 1,
        title: "Orm问候语 - 你好",
        singer: "Orm",
        url: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你好.mp3",
        src: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/3916c9499882d66371bc6573597693bf.jpg",
        lrc: "[00:01.00]你好\n[00:05.00]我是Orm\n[00:10.00]很高兴认识你"
      },
      {
        id: 2,
        title: "Orm问候语 - 再见",
        singer: "Orm",
        url: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 再见.mp3",
        src: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        lrc: "[00:01.00]再见\n[00:05.00]期待下次见面\n[00:10.00]祝你有美好的一天"
      },
      {
        id: 3,
        title: "Orm问候语 - 谢谢",
        singer: "Orm",
        url: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 谢谢.mp3",
        src: "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/ormmm/陈奥/2246a8c4f6c263a32bfbb898a3992cc1.jpg",
        lrc: "[00:01.00]谢谢\n[00:05.00]感谢你的支持\n[00:10.00]我会继续努力的"
      }
    ];

    this.setData({
      musicList: defaultMusicList
    });

    // 初始化音频上下文
    this.initAudioContext();

    // 初始化第一首歌的歌词
    if (defaultMusicList.length > 0 && defaultMusicList[0].lrc) {
      this.parseLyric(defaultMusicList[0].lrc);
    }
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

      // 更新歌词高亮
      this.updateLyric(currentTime);
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

  // 解析歌词
  parseLyric: function (lrc) {
    const lyricArray = [];
    const lines = lrc.split('\n');

    lines.forEach(line => {
      // 匹配时间戳 [mm:ss.xx]
      const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\]/);
      if (timeMatch) {
        const minute = parseInt(timeMatch[1]);
        const second = parseInt(timeMatch[2]);
        const millisecond = parseInt(timeMatch[3]);
        const time = minute * 60 + second + millisecond / 100;

        // 提取歌词文本
        const text = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '').trim();

        lyricArray.push({
          time: time,
          text: text
        });
      }
    });

    this.setData({ lyricArray });
  },

  // 更新歌词高亮
  updateLyric: function (currentTime) {
    const lyricArray = this.data.lyricArray;
    let currentLyricIndex = 0;

    // 查找当前应该高亮的歌词行
    for (let i = 0; i < lyricArray.length; i++) {
      if (lyricArray[i].time <= currentTime) {
        currentLyricIndex = i;
      } else {
        break;
      }
    }

    // 只有当歌词索引发生变化时才更新
    if (currentLyricIndex !== this.data.currentLyricIndex) {
      this.setData({ currentLyricIndex });

      // 滚动到当前歌词
      this.scrollToCurrentLyric();
    }
  },

  // 滚动到当前歌词
  scrollToCurrentLyric: function () {
    // 使用选择器选择当前歌词元素并滚动到可视区域
    const query = wx.createSelectorQuery();
    query.select('#lyric-' + this.data.currentLyricIndex).boundingClientRect();
    query.select('.lyric-container').boundingClientRect();
    query.select('.lyric-container').scrollOffset();

    query.exec((res) => {
      if (res[0] && res[1] && res[2]) {
        const lyricRect = res[0];
        const containerRect = res[1];
        const scrollOffset = res[2].scrollTop;

        // 计算需要滚动的位置，使当前歌词居中
        const toView = lyricRect.top + scrollOffset - containerRect.height / 2;

        // 滚动到指定位置
        wx.createSelectorQuery().select('.lyric-container').node().exec((res) => {
          if (res[0]) {
            // 在真实设备上可以使用以下代码实现平滑滚动
            // res[0].node.scrollTop = toView;
          }
        });
      }
    });
  },

  // 播放/暂停
  togglePlay: function () {
    const audioCtx = this.data.audioCtx;
    if (this.data.isPlaying) {
      audioCtx.pause();
    } else {
      audioCtx.play();
    }
  },

  // 播放指定音乐
  playMusic: function (e) {
    const index = e.currentTarget.dataset.index;
    const music = this.data.musicList[index];

    // 更新当前音乐索引
    this.setData({ currentMusicIndex: index });

    // 验证音频源
    if (!music || !music.url) {
      wx.showToast({
        title: '音乐资源无效',
        icon: 'none'
      });
      return;
    }

    // 重新设置音频源
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

    // 解析并显示歌词
    if (music.lrc) {
      this.parseLyric(music.lrc);
    }
  },

  // 上一首
  prevMusic: function () {
    let currentIndex = this.data.currentMusicIndex;
    currentIndex = (currentIndex - 1 + this.data.musicList.length) % this.data.musicList.length;

    this.setData({ currentMusicIndex: currentIndex });

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

    // 解析并显示歌词
    if (music.lrc) {
      this.parseLyric(music.lrc);
    }
  },

  // 下一首
  nextMusic: function () {
    let currentIndex = this.data.currentMusicIndex;
    currentIndex = (currentIndex + 1) % this.data.musicList.length;

    this.setData({ currentMusicIndex: currentIndex });

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

    // 解析并显示歌词
    if (music.lrc) {
      this.parseLyric(music.lrc);
    }
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

      // 解析并显示歌词
      if (music.lrc) {
        this.parseLyric(music.lrc);
      }
    }
  }
})
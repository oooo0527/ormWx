Page({
  data: {

  },

  onLoad: function (options) {

  },

  // 测试初始化音乐数据库
  testInitMusicDB: function () {
    wx.cloud.callFunction({
      name: 'initDatabase',
      data: {
        action: 'initMusicCollection'
      }
    }).then(res => {
      console.log('初始化音乐数据库结果:', res);
      if (res.result.success) {
        wx.showToast({
          title: '音乐数据库初始化成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '初始化失败: ' + res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  },

  // 测试获取音乐列表
  testGetMusicList: function () {
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getMusicList'
      }
    }).then(res => {
      console.log('获取音乐列表结果:', res);
      if (res.result.success) {
        wx.showToast({
          title: '获取音乐列表成功',
          icon: 'success'
        });
        console.log('音乐列表数据:', res.result.data);
      } else {
        wx.showToast({
          title: '获取失败: ' + res.result.message,
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  },

  // 测试音频播放
  testAudioPlayback: function () {
    // 创建音频上下文进行测试
    const audioCtx = wx.createInnerAudioContext();

    // 使用一个测试音频链接
    audioCtx.src = "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你好.mp3";

    audioCtx.onPlay(() => {
      console.log('音频开始播放');
      wx.showToast({
        title: '音频开始播放',
        icon: 'success'
      });
    });

    audioCtx.onError((res) => {
      console.error('音频播放错误:', res);
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

    audioCtx.onCanplay(() => {
      console.log('音频可以播放');
    });

    // 尝试播放
    audioCtx.play();
  },

  // 测试云音乐播放
  testCloudMusicPlayback: function () {
    wx.cloud.callFunction({
      name: 'dataWorkshop',
      data: {
        action: 'getMusicList'
      }
    }).then(res => {
      console.log('获取音乐列表结果:', res);
      if (res.result.success && res.result.data.length > 0) {
        const music = res.result.data[0];
        console.log('播放音乐:', music);

        // 创建音频上下文进行测试
        const audioCtx = wx.createInnerAudioContext();

        // 使用云音乐链接
        audioCtx.src = music.url;

        audioCtx.onPlay(() => {
          console.log('云音频开始播放');
          wx.showToast({
            title: '云音频开始播放',
            icon: 'success'
          });
        });

        audioCtx.onError((res) => {
          console.error('云音频播放错误:', res);
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

        audioCtx.onCanplay(() => {
          console.log('云音频可以播放');
        });

        // 尝试播放
        audioCtx.play();
      } else {
        wx.showToast({
          title: '获取音乐列表失败',
          icon: 'none'
        });
      }
    }).catch(err => {
      console.error('调用云函数失败:', err);
      wx.showToast({
        title: '网络错误',
        icon: 'none'
      });
    });
  }
})
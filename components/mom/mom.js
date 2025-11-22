// components/mom/mom.js
Component({
  properties: {

  },

  data: {
    // 语音文件映射
    voiceMap: {
      head: '',
      neck: '',
      body: '',
      legs: '',
      feet: ''
    }
  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.initVoicePlayer();
      this.loadVoiceData();
    }
  },

  methods: {
    // 初始化语音播放器
    initVoicePlayer: function () {
      // 创建内部音频上下文
      this.voicePlayer = wx.createInnerAudioContext();
      this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
    },

    // 从云数据库加载语音数据
    loadVoiceData: function () {
      const db = wx.cloud.database();
      const musicCollection = db.collection('miusic');

      // 查询type为mom的语音数据
      musicCollection.where({
        type: 'mom'
      }).get().then(res => {
        console.log('获取到的语音数据:', res.data);

        // 处理返回的数据，构建voiceMap
        const voiceMap = {};
        res.data.forEach(item => {
          // 根据部位字段映射语音文件
          if (item.tag) {
            voiceMap[item.tag] = item.url;
          }
        });

        // 更新数据
        this.setData({
          voiceMap: voiceMap
        });

        console.log('更新后的voiceMap:', this.data.voiceMap);
      }).catch(err => {
        console.error('获取语音数据失败:', err);
        wx.showToast({
          title: '数据加载失败',
          icon: 'none'
        });
      });
    },

    // 播放语音
    playVoice: function (e) {
      const part = e.currentTarget.dataset.part;
      const voiceSrc = this.data.voiceMap[part];

      // 检查语音文件是否存在
      if (!voiceSrc) {
        wx.showToast({
          title: '暂无语音',
          icon: 'none'
        });
        return;
      }

      // 停止当前播放
      this.voicePlayer.stop();

      // 设置新的音频源
      this.voicePlayer.src = voiceSrc;

      // 播放音频
      this.voicePlayer.play();

      // 监听播放事件
      this.voicePlayer.onPlay(() => {
        console.log(`开始播放${part}部位语音`);
      });

      // 监听播放错误事件
      this.voicePlayer.onError((res) => {
        console.error(`播放${part}部位语音失败:`, res);
        wx.showToast({
          title: '播放失败',
          icon: 'none'
        });
      });

      // 监听播放结束事件
      this.voicePlayer.onEnded(() => {
        console.log(`播放${part}部位语音结束`);
      });
    },

    // 停止播放
    stopVoice: function () {
      this.voicePlayer.stop();
    }
  }
})
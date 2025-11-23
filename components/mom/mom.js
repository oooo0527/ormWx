// components/mom/mom.js
Component({
  properties: {

  },

  data: {
    voiceMap: [
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你好.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 你是我的女朋友.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 内个菠萝.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 再见.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 呜呜呜.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 对吧.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 对对对.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我叫Orm.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你，你爱我吗？.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 我爱你哒~.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 早安.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 明天见！.mp3",
      "cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/vedio/等左左买饼干 - 谢谢.mp3",

    ]

  },

  lifetimes: {
    attached: function () {
      // 组件实例进入页面节点树时执行
      this.initVoicePlayer();
    }
  },

  methods: {
    // 初始化语音播放器
    initVoicePlayer: function () {
      // 创建内部音频上下文
      this.voicePlayer = wx.createInnerAudioContext();
      this.voicePlayer.obeyMuteSwitch = false; // 不遵循静音开关
    },



    // 播放语音
    playVoice: function () {
      wx.getRandomValues({
        length: 4,
        success: res => {
          const randomArray = new Uint32Array(res.randomValues);
          const randomIndex = randomArray[0] % this.data.voiceMap.length;
          const selected = this.data.voiceMap[randomIndex];

          // 停止当前播放
          this.voicePlayer.stop();

          // 设置新的音频源
          this.voicePlayer.src = selected;

          // 播放音频
          this.voicePlayer.play();

        },
        fail: err => {
          // 备选方案
          const randomIndex = Math.floor(Math.random() * this.data.voiceMap.length);
          const selected = this.data.voiceMap[randomIndex];


          // 停止当前播放
          this.voicePlayer.stop();

          // 设置新的音频源
          this.voicePlayer.src = selected;

          // 播放音频
          this.voicePlayer.play();
        }
      })





      // 监听播放错误事件
      this.voicePlayer.onError((res) => {

        wx.showToast({
          title: '播放失败',
          icon: 'none'
        });
      });
    },

    // 停止播放
    stopVoice: function () {
      this.voicePlayer.stop();
    }
  }
})
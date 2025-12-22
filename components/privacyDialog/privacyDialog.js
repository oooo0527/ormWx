// components/privacyDialog/privacyDialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是否显示弹窗
    show: {
      type: Boolean,
      value: false
    },
    // 标题
    title: {
      type: String,
      value: '用户隐私保护指引'
    },
    // 内容
    content: {
      type: String,
      value: '请你务必审慎阅读、充分理解“隐私政策”各条款，包括但不限于：为了向你提供即时通讯、分享等服务，我们需要收集你的设备信息、操作日志等信息。你可阅读《隐私政策》了解详细信息。如你同意，请点击“同意”开始接受我们的服务。'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 用户点击同意
    onAgree() {
      this.triggerEvent('agree');
    },

    // 用户点击拒绝
    onDisagree() {
      this.triggerEvent('disagree');
    },

    // 用户点击了解更多
    onLearnMore() {
      this.triggerEvent('learnmore');
    }
  }
})
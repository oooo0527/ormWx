Component({
  properties: {
    // 控制loading是否显示
    show: {
      type: Boolean,
      value: false
    },
    // loading图片路径
    image: {
      type: String,
      value: 'cloud://cloud1-5gzybpqcd24b2b58.636c-cloud1-5gzybpqcd24b2b58-1387507403/relat/purple.png'
    },
    // loading文字
    text: {
      type: String,
      value: '加载中...'
    },
    // 是否全屏显示
    fullScreen: {
      type: Boolean,
      value: false
    }
  },

  data: {
    // 内部状态
  },

  methods: {
    // 组件内部方法
  }
})
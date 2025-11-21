// components/fanVoiceCategory/fanVoiceCategory.js
Component({
  properties: {
    currentCategory: {
      type: String,
      value: 'interaction'
    }
  },

  data: {

  },

  methods: {
    switchCategory: function (e) {
      const category = e.currentTarget.dataset.category;

      // 如果点击的是"添加新专区"，正常切换分类
      if (category === 'new') {
        // 可以在这里添加特殊处理逻辑
      }

      // 触发自定义事件，通知父组件切换分类
      this.triggerEvent('categoryChange', { category });
    }
  }
})
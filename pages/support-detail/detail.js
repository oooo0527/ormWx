// components/support/detail/detail.js
Component({
  properties: {
    supportDetail: {
      type: Object,
      value: {
        id: '',
        title: '',
        description: '',
        coverImage: '',
        date: '',
        year: '',
        location: '',
        images: []
      }
    }
  },

  data: {

  },

  methods: {
    // 预览图片
    previewImage: function (e) {
      const url = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: this.data.supportDetail.images,
        current: url
      });
    }
  }
})
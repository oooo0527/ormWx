Page({
  data: {
    work: {
      id: 0,
      title: "",
      role: "",
      type: "",
      cover: "",
      year: "",
      description: "",
      likes: 0,
      isLiked: false
    }
  },

  onLoad: function (options) {
    // 从上一个页面传递过来的作品数据
    if (options.work) {
      let work = JSON.parse(decodeURIComponent(options.work));
      work.netType=this.mapType(work.type)
      console.log(work)
      this.setData({
        work: work
      });
    } 
  },
  mapType:function(val){
    let obg={
      '1':'电视剧',
      '2':'电影',
      '3':'广告',
      '4':'微电影',
      '5':'其他',
      
    }
    return obg[val]||'其他'
  }

});
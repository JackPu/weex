<template>
  <scroller class="ct">
    <div class="topcontent"></div>
    <div>
      <text>{{topbarStyle}}</text>
    </div>
    <div>
      <text>{{scrollState}}</text>
    </div>
    <div class="topbar" :style="{ marginLeft: topbarStyle + 'px' }"></div>
    <slider class="slider" interval="3000" auto-play="false" offset-x-accuracy="0.1" @scroll="scrollHandler" @change="changeHandler"
      @scrollstart="scrollstartHandler" @scrollend="scrollendHandler" @dragcancel="dragcancelHandler">
      <div class="slider-pages" v-for="item in itemList">
        <image class="img" :src="item.pictureUrl"></image>
        <text class="title">{{item.title}}</text>
      </div>
      <indicator class="indicator"></indicator>
    </slider>
    <div class="content"></div>
  </scroller>
</template>

<style>
  .ct {
    width: 750px;
    flex: 1;
  }
  .topbar{
    width:100px;
    height:20px;
    background-color:red;
  }
  .topcontent {
    width: 750px;
    height: 500px;
    background-color: grey;
  }
  .content {
    width: 750px;
    height: 3000px;
    background-color: grey;
  }
  .img {
    width: 714px;
    height: 150px;
  }
  .title {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #ff0000;
    font-size: 48px;
    font-weight: bold;
    background-color: #eeeeee;
  }
  .slider {
    flex-direction: row;
    margin: 18px;
    width: 714px;
    height: 230px;
  }
  .slider-pages {
    flex-direction: row;
    width: 714px;
    height: 200px;
  }
  .indicator {
    width:714px;
    height:200px;
    position:absolute;
    top:1px;
    left:1px;
    item-color: red;
    item-selectedColor: blue;
    item-size: 20px;
  }
</style>

<script>
  module.exports = {
    data: {
      topbarStyle:0,
      scrollHandlerCallCount:0,
      scrollState:"scrollState",
      itemList: [
        {itemId: '520421163634', title: 'item1', pictureUrl: 'https://gd2.alicdn.com/bao/uploaded/i2/T14H1LFwBcXXXXXXXX_!!0-item_pic.jpg'},
        {itemId: '522076777462', title: 'item2', pictureUrl: 'https://gd1.alicdn.com/bao/uploaded/i1/TB1PXJCJFXXXXciXFXXXXXXXXXX_!!0-item_pic.jpg'},
        {itemId: '522076777462', title: 'iten3', pictureUrl: 'https://gd3.alicdn.com/bao/uploaded/i3/TB1x6hYLXXXXXazXVXXXXXXXXXX_!!0-item_pic.jpg'}
      ]
    },
    methods : {
      scrollHandler: function(e) {
          console.log('scroll')
          this.scrollHandlerCallCount = this.scrollHandlerCallCount + 1;
          this.topbarStyle = -e.offsetXRatio*750
      },
      changeHandler: function(e) {
          this.scrollHandlerCallCount = 0;
      },
      scrollstartHandler: function(e) {
          console.log('scrollstart')
          this.scrollState = "scroll start";
      },
      scrollendHandler: function(e) {
          console.log('scroll stop')
          this.scrollState = "scroll stop";
      },
      dragcancelHandler: function(e) {
          this.scrollState = "drag cancel";
      }  

  }
  }
</script>
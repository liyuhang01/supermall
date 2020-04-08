<template>
  <div id="home">
   
     <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
      <tab-control :titles="['流行','新款','精选']"
         @itemClick="tabClick"
         ref="tabControl1" v-show="isTabFixed"></tab-control>
      <scroll class="content" 
                ref="scroll" 
                :probe-type ="3" 
                @scroll="contentScoll" 
                :pull-up-load="true"
                @pullingUp="loadMore">
        <home-swiper :banners='banners' @swiperImageLoad="swiperImageLoad"/>
        <home-recommend-view :recommends="recommends"></home-recommend-view>
        <home-feature></home-feature>
        <tab-control :titles="['流行','新款','精选']"
         @itemClick="tabClick"
         ref="tabControl2"></tab-control>
        <goods-list :goods="showGoods"></goods-list>

    </scroll>
    <!-- click.native可以监听组件 -->
    <back-top @click.native="backClcik" v-show="isShow"></back-top>
  </div>
</template>

<script>
//子组件
import HomeSwiper from "./childCompents/HomeSwiper"
import HomeRecommendView from './childCompents/HomeRecommendView'
import HomeFeature from './childCompents/HomeFeature'

//公共组件
import NavBar from "components/common/navbar/NavBar"
import TabControl from "components/content/tabControl/TabControl"
import GoodsList from "components/content/goods/GoodsList"
import Scroll from "components/common/scoll/Scoll"
import BackTop from "components/content/backTop/BackTop"

//网络请求
import {getHomeMultidata,getHomeGoods} from 'network/home'
export default {
    name: 'Home',
    components: {     
      HomeSwiper,
      HomeRecommendView,
      HomeFeature,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
    },
    data(){
      return{
        banners: [],
        recommends: [],
        goods:{
          'pop':{page: 0,list: []},
          'new':{page: 0,list: []},
          'sell':{page: 0,list: []},
        },
        currentType: 'pop',
        isShow: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        itemImgListener: null,
      }
    },
    
    created () {
       // 1.请求多个数据
      this.getHomeMultidata();

        // 2.请求商品数据
      this.getHomeGoods('pop');
       this.getHomeGoods('new');
        this.getHomeGoods('sell');


        
    },
    mounted () {


      //1.监听GoodsListItem中图片加载完成
       this.itemImgListener = this.$bus.$on('itemImageLoad',() =>{
            //不做防抖动时，页面就刷新了30遍，refresh函数就执行了30遍。
           //this.$refs.scroll.refresh()
          this.refresh()
        })
      //判断是否是手机展示
        if(this._isMobile()) {
        // console.log(this.$tabbar)
       
        this.$toast.show('如果商品不显示，请尝试刷新或者稍后再试。', 1500)
        setTimeout(() => {
          this.$toast.show('GitHub：liyuhang01', 2500)
        }, 1500);
      } else {
        this.$toast.show('建议使用手机浏览器获得更好体验', 9000)
      }
   

    },
    activated () {
       //要刷新一次，不然就会导致返回到首页时返回到顶部了。
       this.$refs.scroll.refresh()
       // 返回页面时滚动到离开时记录的位置并刷新
      this.$refs.scroll.backTop(0,this.saveY,0)
     
     
    },
    deactivated () {
       // 离开页面时记录页面离开时的滚动位置
      this.saveY = this.$refs.scroll.getScrollY()
       // 离开页面时取消全局事件的监听
      this.$bus.$off('itemImgLoad',this.itemImgListener)
  
    },



    computed: {
      showGoods(){
         return this.goods[this.currentType].list
      }
    },
  
    methods: {
      _isMobile() {
          let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
        // console.log(flag)
          return flag;
      },

      //事件监听相关的方法
      //防抖函数
      debounce(func,delay){
          let timer = null
          return function (...args) {
            if(timer){
              clearTimeout(timer)
            }
            timer = setTimeout(() =>{
              func.apply(this,args)
            },delay)
          }
         
      },
      refresh(){
          this.debounce(this.$refs.scroll.refresh,500)
         // console.log(this.$refs.scroll.refresh)
      },
      tabClick(index){
          switch (index) {
            case 0:
                this.currentType = 'pop'
              break;
            case 1:
                this.currentType = 'new'
              break;
            case 2:
                this.currentType = 'sell'
              break;  
          }
          this.$refs.tabControl1.currentIndex = index;
            this.$refs.tabControl2.currentIndex = index;
            // 点击tabcontrol滚动到相应的位置
            this.$refs.scroll.backTop(0, (-this.tabOffsetTop))
      },
      backClcik(){
          this.$refs.scroll.backTop(0,0,500);
      },
      contentScoll(position){
    
       this.isShow = (-position.y) > this.tabOffsetTop;
       this.isTabFixed = (-position.y) > this.tabOffsetTop
       
      },
        //加载更多
      loadMore(){
      
        this.getHomeGoods(this.currentType);
         this.$refs.scroll.finishPullUp()
      },
      //tabControl的吸顶效果
      swiperImageLoad(){
         //获取tabControld的offsetTop
       //所有的组件都有一个属性，$el,用于获取组件中的元素
       this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
       
      },





      //网络请求
      getHomeMultidata(){
           getHomeMultidata().then(res =>{
           // console.log(res)
            this.banners = res.data.banner.list;
            this.recommends = res.data.recommend.list;
      })
      },
      getHomeGoods(type){
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res =>{
          // console.log(res)
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page +=1;

         
        })
      }
    },
  
}
</script>

<style scoped>
#home{
  /* padding-top: 44px; */
  padding-bottom: 49px;
  height: 100vh;
  position: relative;
}
.home-nav{
  background-color: var(--color-tint);
  color: #fff;

  /* position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 9; */
}

.content{
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.tab-control{
  position: relative;
  z-index: 9;
}
</style>
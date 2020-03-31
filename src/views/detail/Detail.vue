<template>
  <div id="detail">
      <detail-nav-bar class="nav" @titleClick="titleClick" ref="nav"></detail-nav-bar>
     
      <scroll class="content" ref="scroll"  :probe-type = '3' @scroll="contentScroll">
        <detail-swiper :topImages="topImage"></detail-swiper>
        <detail-base-info :goods='goods'></detail-base-info>
        <detail-shop-info :shop="Shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo"  @imageLoad="imageLoad" ref="goodsInfo"></detail-goods-info>
        <detail-param-info :param-info="paramsInfo" ref="params"></detail-param-info>
        <detail-comment-info :comment-info="commentInfo" ref="comment"></detail-comment-info>
        <goods-list :goods="recommends" ref="recommends"></goods-list>
      </scroll>
      <back-top  @click.native = "backClick" v-show = 'isShow'></back-top>
      <detail-bottom-bar @addCart="addCart" @buyTocart="buyTocart"></detail-bottom-bar>
  </div>
</template>

<script>
//公共组件
import Scroll from "components/common/scoll/Scoll"
import GoodsList from "components/content/goods/GoodsList"
import debounce from 'common/utils'
import {itemListenerMixin,backTopMixin} from 'common/mixin'
//子组件
import DetailNavBar from "./childConponments/DetailNavBar"
import DetailSwiper from "./childConponments/DetailSwiper"
import DetailBaseInfo from './childConponments/DetailBaseInfo'
import DetailShopInfo from "./childConponments/DetailShopInfo"
import DetailGoodsInfo from './childConponments/DetailGoodsInfo'
import DetailParamInfo from "./childConponments/DetailParamInfo"
import DetailCommentInfo from "./childConponments/DetailCommentInfo"
import DetailBottomBar from "./childConponments/DetailBottomBar"
//网络请求
import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail"
export default {
   
    name:'Detail',
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
    },
    data () {
        return {
            iid: null,
            topImage: [],
            goods:{},
            Shop:{},
            detailInfo:{},
            paramsInfo:{},
            commentInfo: {},
            recommends:[],
            themeTopYs: [],
            currentIndex:0,
        }
    },
   mixins: [itemListenerMixin,backTopMixin],
    created () {
        //1.拿到商品的iid
        this.iid = this.$route.params.iid
        //2.根据iid进行网络请求
        getDetail(this.iid).then(res =>{
           //1.获取顶部轮播的数据
            this.topImage = res.result.itemInfo.topImages;
            const data = res.result;
            // 获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
            //获取店铺信息
            this.Shop = new Shop(data.shopInfo)
            //获取商品详情数据
            this.detailInfo = data.detailInfo;
            //获取商品参数信息
            this.paramsInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);
            // 获取评论信息
            if(data.rate.cRate !== 0) {
            this.commentInfo = data.rate.list[0]
            }
        })
        //3.获取推荐信息
        getRecommend().then(res=>{
            this.recommends = res.data.list;
        })
    },
   
    destroyed () {
      this.$bus.$off('itemImageLoad',this.itemImgListener)  
    },
    methods: {

        // 判断图片加载完成，刷新可滚动区域
        imageLoad(){            
            this.$refs.scroll.refresh()
                this.themeTopYs = []
                this.themeTopYs.push(0);
                this.themeTopYs.push(this.$refs.params.$el.offsetTop);
                this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
                this.themeTopYs.push(this.$refs.recommends.$el.offsetTop);
                this.themeTopYs.push(Number.MAX_VALUE)
                //console.log(this.themeTopYs)
            },
         // 点击navbar滚动到对应的位置
        titleClick(index){
           this.$refs.scroll.backTop(0,-this.themeTopYs[index],250)
             
        },
      
        contentScroll(position){
          // 获取Y值
        const positionY = -position.y
      
        // 与themeTopY进行比对，滚动时让navbar中标题和内容对应
        let length = this.themeTopYs.length;
        for(let i =0; i < length-1; i++) {
          if(this.currentIndex !== i && (positionY >=  this.themeTopYs[i] && positionY < this.themeTopYs[i+1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex
            // console.log(this.currentIndex )
          }
         
        };
         // 判断backtop是否显示
         this.isShow = (- position.y) > this.$refs.goodsInfo.$el.offsetTop;
        },
        //点击添加购物车
        addCart(){
           //1.获取购物车需要展示的信息
            const product = {}
            product.image = this.topImage[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.realPrice;
            product.iid = this.iid;
            console.log(product)
            // 2.放入到购物车中
            if(product.iid){
                this.$store.dispatch('addCart',product).then(res =>{
                  //  console.log(this.$toast)
                    this.$toast.show(res,1500);
                })
            }else {
            this.$toast.show('添加失败请刷新重试', 1500)
            }
           
        },
        //点击购买
        buyTocart(){
            const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.iid;
        // 放入到购物车中
        if(product.iid){
        this.$store.dispatch('buyNow',product).then(res => {
          this.$toast.show(res, 1500)
          this.$router.push('/cart')
        })}else {
          this.$toast.show('添加失败请刷新重试', 1500)
        }
        }
    }

}
</script>

<style scoped>
#detail{
    position: relative;
    background-color: #fff;
    z-index: 9;
    height: 100vh;
}
.nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
}
.content{
    position: absolute;
    top: 44px;
    bottom: 49px;
    overflow: hidden;
}
</style>
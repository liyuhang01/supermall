<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
          <slot></slot>
      </div>
  </div>
</template>

<script>
import BScroll from "better-scroll"
export default {
    name: 'Scoll',
    data () {
        return {
            scroll: null,
        }
    },
    props:{
       probeType:{
           type: Number,
           default: 0,
       },
       pullUpLoad:{
           type: Boolean,
           default: false,
       }
    },
    // activated () {
    //      //先refresh一下，解决了详情页图片没有加载出来导致乱码的问题。
    //      this.refresh();
    // },
    mounted () {
        //1.创建BSscroll对象
        this.scroll = new BScroll(this.$refs.wrapper,{
            //默认为false，不能在scroll中监听点击事件，
            click: true,
            //实时位置的属性
            probeType: this.probeType,
            //上拉加载的属性
            pullUpLoad: this.pullUpLoad,
            
        })
        //2.监听滚动的位置
        if (this.probeType == 2 || this.probeType == 3){
            this.scroll.on('scroll', (position) =>{
                this.$emit('scroll',position)
            
            })
        }
        //3.监听上拉加载事件
         if (this.pullUpLoad){
            this.scroll.on('pullingUp', () =>{
               
                // console.log("加载更多")
                this.$emit('pullingUp')
              
            })
          }
       
    },
    methods: {
        //回到顶部,默认为500ms
        backTop(x,y,time = 500){
            this.scroll && this.scroll.scrollTo(x,y,time)
        },
        //完成加载中,只有完成加载中，才能进行下一次的上拉加载。
       
        finishPullUp(){
             // 2秒后再次上拉加载,设置延迟避免重复加载
             
           setTimeout(() => {
              
                 this.scroll && this.scroll.finishPullUp()
            }, 2000);
            // console.log("加载更多")
        },
       //解决滚动区域的bug,就是图片加载一次刷新一次页面，为了获取最终scroll的高度。
       refresh() {
           //console.log('-----------')
            this.scroll && this.scroll.refresh()
       },
       getScrollY(){
           return this.scroll ? this.scroll.y : 0
       }
    }
}
</script>

<style>

</style>
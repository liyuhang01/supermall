<template>
  <swiper>
      <swiper-item v-for="(item,index) in banners" :key="index">
          <a :href="item.link">
            <img :src="item.image" @load="imageload">
          </a>
      </swiper-item>
    </swiper>
</template>

<script>

import {Swiper,SwiperItem} from "components/common/swiper/index"
export default {
    name: 'HomeSwiper',
    components: {
        Swiper,
        SwiperItem,
        isLoad: false,
    },
    methods: {
      imageload(){
          if(!this.isLoad){
           // console.log('-----------')
            this.$emit('swiperImageLoad')
            this.isLoad = true;
          }   
      }  
    },
    props:{
        banners:{
            type: Array,
            default(){
                return []
            }
        }
    }
}
</script>

<style>

</style>
<template>
  <div class="goods" >
     
      <goods-list-item v-for="(item,index) in goods" :goodsItem = "item" :key = "index"></goods-list-item>
      
  </div>
</template>

<script>
import GoodsListItem from "components/content/goods/GoodsListItem"
export default {
    name: 'GoodsList',
    components: {
        GoodsListItem,
    },
    props: {
        goods:{
            type: Array,
            default(){
                return []
            }
        }
    },
   
}
</script>

<style>
.goods{
    display: flex;
    justify-content: space-around;
    /* 不让flex中的内容在一行内显示 */
    flex-wrap: wrap;
}
</style>
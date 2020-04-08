<template>
  <div class="goods-item" @click="itemClick()">
        <img v-lazy="showImg" alt="" @load="imageLoad">
        <div class="goods-info">
            <p>{{goodsItem.title}}</p>
            <span class="price">价格：{{goodsItem.price}}</span>
            <span class="collect">{{goodsItem.cfav}}</span>
        </div>
  </div>
</template>

<script>
export default {
    name:"GoodsListItem",
    props: {
        goodsItem:{
            type: Object,
            default(){
                return []
            }
        }
    },
    methods: {
      //监听图片加载完成
      imageLoad(){
        // console.log('load')
        //$bus叫事件总线，类似于vuex，但是只是监听事件，不同于vuex是管理整个项目的状态，可以在main.js中直接定义vue的原型，
        this.$bus.$emit("itemImageLoad")
      },
      // 点击跳转详情页，进行一个判断
      itemClick(){
         this.goodsItem.iid ? this.$router.push('./detail/' + this.goodsItem.iid) : this.$toast.show('该页面尚未完成', 1500)
      }
    },
     computed: {
        showImg(){
          return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
        }
    }
}
</script>

<style scoped>
  .goods-item {
        width: 48%;
        padding-bottom: 40px;
        position: relative;  
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }
</style>
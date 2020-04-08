<template>
  <div class="tab-control">
      <div v-for="(item,index) in titles" :key ="index" class="tab-control-item" :class="{active: index === currentIndex}" @click="tabClick(index)">
          <span>
            {{item}}
          </span>
      </div>
  </div>
</template>

<script>
export default {
    name: 'TabControl',
    data(){
        return{
            currentIndex: 0,
        }
    },
    methods: {
      tabClick(index){
          this.currentIndex = index;
          this.$emit("itemClick",index)
      }  
    },
    props:{
        titles:{
            type: Array,
            default(){
                return []
            }
        }
    }
}
</script>

<style scoped>
.tab-control{
    display: flex;
    height: 44px;
    line-height: 44px;
    text-align: center; 
    /* 这个属性就是当距离顶部多少时变成fixed */
    /* 当使用better-scroll的时候就没有用了 */
    /* position: sticky; */
    /* top: 44px; */
    background: #fff;

}
.tab-control-item{
    flex: 1;
}
.active{
    color: var(--color-high-text);
}
.active span{
    padding: 5px;
    border-bottom: 2px solid  var(--color-high-text);
}
</style>
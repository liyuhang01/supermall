<template>
  <div >
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
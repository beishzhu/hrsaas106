<template>
  <div>
    <svg-icon icon-class="fullscreen" style="color:#fff; width: 20px; height: 20px" @click="changeScreen"></svg-icon>
  </div>
</template>

<script>
import ScreenFull from 'screenfull'
export default {
  methods: {
    // 改变全屏
    changeScreen() {
      // document.documentElement.requestFullscreen() // 原生全屏的写法
      if (!ScreenFull.isEnabled) {
        this.$message.waring('此时全屏组件不可用')
        return
      }
      // 如果可用就能全屏
      ScreenFull.toggle()
    }
  }
}
</script>

<style scoped>
</style>

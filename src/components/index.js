import zhInput from './zhInput/zhInput.vue'
import zhImgList from './zhImgList/zhImgList.vue'
export default {
  install: function (vue) {
    vue.component('zhInput', zhInput)
    vue.component('zhImgList', zhImgList)
  }
}

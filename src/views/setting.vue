<template>
  <div id="setting"
    class="contentMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">用户设置</span>
      </div>
      <div class="settingCtn">
        <div class="line">
          <div class="label">常用产品尺寸：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localSizeArr"
              :key="item"
              @close="deleteLocal(item,'size')">{{item}}</el-tag>
          </div>
        </div>
        <div class="line">
          <div class="label">常用产品色组：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localColorArr"
              :key="item"
              @close="deleteLocal(item,'color')">{{item}}</el-tag>
          </div>
        </div>
        <div class="line">
          <div class="label">常用产品单位：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localClientArr"
              :key="item"
              @close="deleteLocal(item,'client')">{{item}}</el-tag>
          </div>
        </div>
        <div class="line">
          <div class="label">常用物料名称：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localYarnnameArr"
              :key="item"
              @close="deleteLocal(item,'yarnname')">{{item}}</el-tag>
          </div>
        </div>
        <div class="line">
          <div class="label">常用物料颜色：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localYarncolorArr"
              :key="item"
              @close="deleteLocal(item,'yarncolor')">{{item}}</el-tag>
          </div>
        </div>
        <div class="line">
          <div class="label">常用物料单位：</div>
          <div class="tagCtn">
            <el-tag closable
              v-for="item in localYarnclientArr"
              :key="item"
              @close="deleteLocal(item,'yarnclient')">{{item}}</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      localYarnclientArr: [],
      localYarncolorArr: [],
      localYarnnameArr: [],
      localClientArr: [],
      localColorArr: [],
      localSizeArr: []
    }
  },
  methods: {
    deleteLocal (item, type) {
      if (type === 'size') {
        this.localSizeArr.splice(this.localSizeArr.indexOf(item), 1)
        window.localStorage.setItem('size', JSON.stringify(this.localSizeArr))
      }
      if (type === 'color') {
        this.localColorArr.splice(this.localColorArr.indexOf(item), 1)
        window.localStorage.setItem('color', JSON.stringify(this.localColorArr))
      }
      if (type === 'client') {
        this.localClientArr.splice(this.localClientArr.indexOf(item), 1)
        window.localStorage.setItem('client', JSON.stringify(this.localClientArr))
      }
      if (type === 'yarnclient') {
        this.localYarnclientArr.splice(this.localYarnclientArr.indexOf(item), 1)
        window.localStorage.setItem('yarnclient', JSON.stringify(this.localYarnclientArr))
      }
      if (type === 'yarncolor') {
        this.localYarncolorArr.splice(this.localYarncolorArr.indexOf(item), 1)
        window.localStorage.setItem('yarncolor', JSON.stringify(this.localYarncolorArr))
      }
      if (type === 'yarnname') {
        this.localYarnnameArr.splice(this.localYarnnameArr.indexOf(item), 1)
        window.localStorage.setItem('yarnname', JSON.stringify(this.localYarnnameArr))
      }
    }
  },
  mounted () {
    this.localYarnclientArr = JSON.parse(window.localStorage.getItem('yarnclient')) || []
    this.localYarncolorArr = JSON.parse(window.localStorage.getItem('yarncolor')) || []
    this.localYarnnameArr = JSON.parse(window.localStorage.getItem('yarnname')) || []
    this.localClientArr = JSON.parse(window.localStorage.getItem('client')) || []
    this.localColorArr = JSON.parse(window.localStorage.getItem('color')) || []
    this.localSizeArr = JSON.parse(window.localStorage.getItem('size')) || []
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/setting.less";
</style>

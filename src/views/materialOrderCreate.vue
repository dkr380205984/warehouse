<template>
  <div id="yarnOrderCreate"
    class="contentMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">辅料采购信息</span>
        <div class="btn btnBlue"
          @click="createStoreFlag=true">添加新仓库</div>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单信息
              <span class="explanation">(必填)</span>
            </span>
            <div class="content">
              <zh-input v-model="orderName"
                placeholder="请输入订单号"></zh-input>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">物料公司名称</span>
            <div class="content">
              <el-autocomplete class="inputs"
                v-model="clientName"
                :fetch-suggestions="querySearchClient"
                placeholder="请输入物料公司名称"></el-autocomplete>
            </div>
          </div>
          <div class="colCtn flex3">
            <span class="label">下单日期</span>
            <div class="content">
              <el-date-picker v-model="orderDate"
                class="inputs"
                style="width:100%"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息
            </span>
            <div class="content">
              <zh-input v-model="desc"
                placeholder="请输入备注信息"></zh-input>
            </div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row">辅料名称</span>
              <span class="tb_row">单价</span>
              <span class="tb_row">颜色/属性</span>
              <span class="tb_row">数量</span>
              <span class="tb_row middle">总价</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in yarnInfo"
              :key="index">
              <span class="tb_row">
                <el-autocomplete class="editInput"
                  v-model="item.yarnName"
                  :fetch-suggestions="querySearchYarn"
                  placeholder="请输入辅料名称"></el-autocomplete>
              </span>
              <span class="tb_row">
                <el-input class="editInput"
                  placeholder="请输入单价"
                  v-model="item.price">
                  <template slot="append">元</template>
                </el-input>
              </span>
              <span class="tb_row tb_col"
                style="flex:4">
                <span class="tb_col_item"
                  v-for="(itemChild,indexChild) in item.childrenArr"
                  :key="indexChild">
                  <span class="tb_row">
                    <el-autocomplete class="editInput"
                      v-model="itemChild.color"
                      :fetch-suggestions="querySearchColor"
                      placeholder="请输入辅料颜色/属性"></el-autocomplete>
                  </span>
                  <span class="tb_row"
                    style="position:relative">
                    <el-input class="editInput"
                      placeholder="请输入采购数量"
                      v-model="itemChild.number">
                    </el-input>
                    <input class="unit"
                      placeholder="单位"
                      @change="getUnit(item,itemChild.unit)"
                      v-model="itemChild.unit" />
                  </span>
                  <span class="tb_row middle">
                    <span class="editInput"
                      style="line-height:32px">{{Number(itemChild.number*item.price)}}元</span>
                  </span>
                  <span class="tb_row middle"
                    style="user-select: none;">
                    <span class="tb_handle_btn blue"
                      @click="addColor(item)">添加色组</span>
                    <span class="tb_handle_btn red"
                      @click="deleteColor(item,index,indexChild)">删除色组</span>
                  </span>
                </span>
              </span>
            </div>
            <div class="tb_content"
              style="padding:0">
              <span class="tb_row tb_row_handle_btn"
                @click="addYarn">+新增辅料</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="popup"
      v-show="createStoreFlag">
      <div class="main">
        <div class="title">
          <div class="text">添加仓库</div>
          <i class="el-icon-close"
            @click="createStoreFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">仓库名称：</div>
            <div class="info">
              <el-input placeholder="请输入仓库名称(不超过10个中文字)"
                v-model="storeInfo.name"></el-input>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="createStoreFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="saveStore">确定</div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <div class="btn btnBlue"
            @click="saveAll">添加</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { store, yarnOrder } from '@/assets/js/api.js'
import { flatten } from '@/assets/js/common.js'
export default {
  data () {
    return {
      createStoreFlag: false,
      orderName: '',
      clientName: '',
      desc: '',
      yarnInfo: [{
        yarnName: '',
        price: '',
        childrenArr: [{
          color: '',
          number: ''
        }]
      }],
      storeInfo: {
        name: ''
      },
      localYarnclientArr: [],
      localYarncolorArr: [],
      localYarnnameArr: [],
      orderDate: (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) : (new Date()).getMonth() + 1) + '-' + ((new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate())
    }
  },
  methods: {
    querySearchClient (queryString, cb) {
      cb(queryString ? this.addValue(this.localYarnclientArr.filter(this.createFilter(queryString))) : this.addValue(this.localYarnclientArr))
    },
    querySearchYarn (queryString, cb) {
      cb(queryString ? this.addValue(this.localYarnnameArr.filter(this.createFilter(queryString))) : this.addValue(this.localYarnnameArr))
    },
    querySearchColor (queryString, cb) {
      cb(queryString ? this.addValue(this.localYarncolorArr.filter(this.createFilter(queryString))) : this.addValue(this.localYarncolorArr))
    },
    createFilter (queryString) {
      return (obj) => {
        return (obj.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    getUnit (item, unit) {
      item.childrenArr.forEach((itemChild) => {
        itemChild.unit = unit
      })
    },
    getLocal (type, name) {
      if (type === 'yarnclient') {
        if (this.localYarnclientArr.indexOf(name) !== -1) {
          return
        }
        this.localYarnclientArr.push(name)
        window.localStorage.setItem('yarnclient', JSON.stringify(this.localYarnclientArr))
      }
      if (type === 'yarncolor') {
        if (this.localYarncolorArr.indexOf(name) !== -1) {
          return
        }
        this.localYarncolorArr.push(name)
        window.localStorage.setItem('yarncolor', JSON.stringify(this.localYarncolorArr))
      }
      if (type === 'yarnname') {
        if (this.localYarnnameArr.indexOf(name) !== -1) {
          return
        }
        this.localYarnnameArr.push(name)
        window.localStorage.setItem('yarnname', JSON.stringify(this.localYarnnameArr))
      }
    },
    // 能把数组转为对象数组
    addValue (arr) {
      return arr.map((item) => {
        return {
          value: item
        }
      })
    },
    addYarn () {
      this.yarnInfo.push({
        yarnName: '',
        price: '',
        childrenArr: [{
          color: '',
          number: '',
          unit: ''
        }]
      })
    },
    addColor (item) {
      item.childrenArr.push({
        number: '',
        color: '',
        unit: item.childrenArr[0].unit ? item.childrenArr[0].unit : ''
      })
    },
    deleteColor (item, index, indexChild) {
      if (item.childrenArr.length === 1) {
        this.yarnInfo.splice(index, 1)
      } else {
        item.childrenArr.splice(indexChild, 1)
      }
    },
    saveStore () {
      if (!this.storeInfo.name) {
        this.$message.error('请填写仓库名称')
      }
      store.create({
        id: null,
        name: this.storeInfo.name,
        type: 2
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
        this.createStoreFlag = false
      })
    },
    saveAll () {
      let errMsg = ''
      if (!this.orderName) {
        errMsg = '请输入采购单名称/单号'
      }
      if (!this.clientName) {
        errMsg = '请输入物料公司名称'
      }
      if (!this.orderDate) {
        errMsg = '请选择下单日期'
      }
      this.yarnInfo.forEach((item) => {
        if (!item.yarnName) {
          errMsg = '有未填写的原料名称'
        }
        if (!item.price) {
          errMsg = '有未填写的单价信息'
        }
        item.childrenArr.forEach((itemChild) => {
          if (!itemChild.color) {
            errMsg = '有未填写的颜色信息'
          }
          if (!itemChild.number) {
            errMsg = '有未填写的数量信息'
          }
          if (!itemChild.unit) {
            errMsg = '有未填写的单位信息'
          }
        })
      })
      if (errMsg) {
        this.$message.error(errMsg)
        return
      }
      const formData = {
        order_type: 2,
        order_code: this.orderName,
        client_name: this.clientName,
        order_time: this.orderDate,
        desc: this.desc,
        material_info: flatten(flatten(this.yarnInfo)).map((item) => {
          return {
            material_name: item.yarnName,
            material_attribute: item.color,
            price: item.price,
            weight: item.number,
            unit: item.unit,
            material_type: 2
          }
        })
      }
      this.getLocal('yarnclient', this.clientName)
      formData.material_info.forEach((item) => {
        this.getLocal('yarnname', item.material_name)
        this.getLocal('yarncolor', item.material_attribute)
      })
      yarnOrder.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.$router.push('/yarnOrderList/page=1')
        }
      })
    }
  },
  mounted () {
    this.localYarnclientArr = JSON.parse(window.localStorage.getItem('yarnclient')) || []
    this.localYarncolorArr = JSON.parse(window.localStorage.getItem('yarncolor')) || []
    this.localYarnnameArr = JSON.parse(window.localStorage.getItem('yarnname')) || []
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/yarnOrderCreate.less";
</style>

<template>
  <div id="yarnOrderDetail"
    class="contentMain"
    v-loading="loading">
    <div class="module">
      <div class="titleCtn">
        <span class="title">计划单信息</span>
      </div>
      <div class="detailCtn"
        style="border-top:0">
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">系统编号：</span>
            <span class="text">{{yarnOrderDetail.inside_code}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn flex3">
            <span class="label">订单信息：</span>
            <span class="text"
              style="color:#1a95ff">{{yarnOrderDetail.order_code}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订购公司：</span>
            <span class="text">{{yarnOrderDetail.client_name}}</span>
          </div>
          <div class="colCtn flex3">
            <span class="label">订购日期：</span>
            <span class="text">{{yarnOrderDetail.order_time}}</span>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn">
            <span class="label">备注信息：</span>
            <span class="text">{{yarnOrderDetail.desc}}</span>
          </div>
        </div>
      </div>
      <div class="listCtn">
        <div class="tableCtnLv2">
          <div class="tb_header bigPadding">
            <span class="tb_row two_line">纱线名称</span>
            <span class="tb_row">单价</span>
            <span class="tb_row">颜色</span>
            <span class="tb_row">订购数量</span>
            <span class="tb_row">入库数量</span>
            <span class="tb_row">入库总价</span>
            <span class="tb_row middle">操作</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item v-for="(item,index) in yarnOrderDetail.material_info"
              :key="index">
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row two_line">{{item.material_name}}</span>
                <span class="tb_row">{{item.price}}元</span>
                <span class="tb_row">{{item.material_attribute}}</span>
                <span class="tb_row"
                  style="color:#1a95ff">{{item.weight}}kg</span>
                <span class="tb_row"
                  style="color:#E6A23C">{{item.in_weight}}kg</span>
                <span class="tb_row"
                  style="color:#01B48C">{{Number(item.price*item.in_weight)}}元</span>
                <span class="tb_row middle">
                  <span class="tb_handle_btn blue"
                    @click.stop="addOpr(1,item.id,item.price,item.weight,item.material_name,item.material_attribute)">入库</span>
                  <span class="tb_handle_btn blue"
                    @click.stop="addOpr(2,item.id,item.price,item.weight,item.material_name,item.material_attribute)">出库</span>
                  <span class="tb_handle_btn blue"
                    @click.stop="addOpr(3,item.id,item.price,item.weight,item.material_name,item.material_attribute)">回库</span>
                </span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row">缸号/批号</span>
                  <span class="tb_row">色号</span>
                  <span class="tb_row">操作类型</span>
                  <span class="tb_row">数量</span>
                  <span class="tb_row">件数</span>
                  <span class="tb_row">总价</span>
                  <span class="tb_row">仓库</span>
                  <span class="tb_row">单位</span>
                  <span class="tb_row">备注</span>
                  <span class="tb_row">操作人</span>
                  <span class="tb_row">时间</span>
                  <span class="tb_row">操作</span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight"
                  v-for="itemChild in item.logList"
                  :key="itemChild.id">
                  <span class="tb_row">{{itemChild.vat_code}}</span>
                  <span class="tb_row">{{itemChild.color_code}}</span>
                  <span class="tb_row">{{itemChild.action_type===1?'入库':itemChild.action_type===2?'出库':'回库'}}</span>
                  <span class="tb_row">{{itemChild.weight}}kg</span>
                  <span class="tb_row">{{itemChild.number}}件</span>
                  <span class="tb_row">{{itemChild.weight*item.price}}元</span>
                  <span class="tb_row">{{itemChild.store_name}}</span>
                  <span class="tb_row">{{itemChild.client_name}}</span>
                  <span class="tb_row">{{itemChild.desc}}</span>
                  <span class="tb_row">{{itemChild.user_name}}</span>
                  <span class="tb_row">{{itemChild.complete_time}}</span>
                  <span class="tb_row">
                    <span class="tb_handle_btn blue"
                      style="padding:0 5px 0 0"
                      v-if="itemChild.action_type===2"
                      @click.stop="addOpr(3,item.id,item.price,item.weight,item.material_name,item.material_attribute,itemChild.vat_code,itemChild.color_code,itemChild.store_id)">回库</span>
                    <span class="tb_handle_btn blue"
                      style="padding:0 5px 0 0"
                      v-if="itemChild.action_type===1"
                      @click.stop="addOpr(2,item.id,item.price,item.weight,item.material_name,item.material_attribute,itemChild.vat_code,itemChild.color_code,itemChild.store_id)">出库</span>
                    <span class="tb_handle_btn red"
                      style="padding:0"
                      @click="deleteLog(itemChild.id)">删除</span>
                  </span>
                </div>
                <div class="tb_collapse tb_content bigPadding smallHeight"
                  v-if="item.logList.length===0">
                  <span class="tb_row"
                    style="justify-content:space-around">暂无出入库信息</span>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="createModule"
          v-for="(item,index) in formData"
          :key="index">
          <div class="deleteIconBtn">
            <i class="el-icon-close"
              @click="deleteData(index)"></i>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">名称/属性</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <el-select placeholder="请选择纱线"
                  v-model="item.yarn_id">
                  <el-option v-for="item in nameColorArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">批次/缸号</span>
              </div>
              <div class="content">
                <el-input placeholder="请填写批次/缸号"
                  v-model="item.attr"></el-input>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">色号</span>
              </div>
              <div class="content">
                <el-input placeholder="请填写色号"
                  v-model="item.colorDetail"></el-input>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">{{Number(item.type)===1?'入库':Number(item.type)===2?'出库':'回库'}}数量</span>
                <span class="explanation">(必填)</span>
              </div>
              <div class="content">
                <el-input placeholder="请填写数量"
                  v-model="item.number"></el-input>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">{{Number(item.type)===1?'入库':Number(item.type)===2?'出库':'回库'}}件数</span>
              </div>
              <div class="content">
                <el-input placeholder="请填写件数"
                  v-model="item.jianshu"></el-input>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">{{Number(item.type)===1?'入库':Number(item.type)===2?'出库':'回库'}}仓库</span>
                <span class="explanation">(必选)</span>
              </div>
              <div class="content">
                <el-select v-model="item.store_id"
                  placeholder="请选择仓库">
                  <el-option v-for="item in storeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="rowCtn">
            <div class="colCtn">
              <div class="label">
                <span class="text">{{Number(item.type)===1?'入库':Number(item.type)===2?'出库':'回库'}}总价</span>
              </div>
              <div class="content">
                <span class="inputspan">{{Number(item.number*item.price)}}元</span>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">{{Number(item.type)===1?'入库':Number(item.type)===2?'出库':'回库'}}时间</span>
              </div>
              <div class="content">
                <el-date-picker v-model="item.date"
                  class="inputs"
                  style="width:100%"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </div>
            </div>
            <div class="colCtn">
              <div class="label">
                <span class="text">备注信息</span>
              </div>
              <div class="content">
                <el-input v-model="item.desc"
                  placeholder="输入备注">
                </el-input>
              </div>
            </div>
          </div>
          <div class="rowCtn"
            v-if="item.type!==1">
            <div class="colCtn">
              <div class="label">
                <span class="text">{{item.type===2?'出库':'回库'}}单位</span>
              </div>
              <div class="content">
                <el-input v-model="item.client_name"
                  placeholder="输入单位">
                </el-input>
              </div>
            </div>
            <div class="colCtn">
            </div>
            <div class="colCtn">
            </div>
          </div>
        </div>
        <div class="addRows"
          v-if="formData.length>0">
          <span class="once cancle"
            @click="cancle">取消</span>
          <span class="once ok"
            @click="saveAll">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formCheck } from '@/assets/js/common.js'
import { yarnOrder, store, yarnOutAndIn } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      nameColorArr: [],
      storeList: [],
      formData: [],
      yarnOrderDetail: {
        client_name: '',
        desc: '',
        id: null,
        inside_code: '',
        order_code: '',
        order_time: '',
        material_info: []
      }
    }
  },
  methods: {
    deleteData (index) {
      this.formData.splice(index, 1)
    },
    addOpr (type, id, price, weight, name, color, vat, colorCode, storeId) {
      this.formData.push({
        yarn_id: id,
        material_name: name || '',
        client_name: '',
        material_attribute: color || '',
        attr: vat || '',
        colorDetail: colorCode || '',
        number: '',
        weight: weight || 0,
        jianshu: '',
        store_id: storeId || '',
        price: price || 0,
        date: (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) : (new Date()).getMonth() + 1) + '-' + ((new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate()),
        type: type,
        desc: ''
      })
    },
    cancle () {
      this.formData = []
    },
    saveAll () {
      let errMsg = ''
      this.formData.forEach((item) => {
        errMsg = formCheck(item.number, 'ifNumber', '请填写数量')
        errMsg = formCheck(item.store_id, 'ifNull', '请选择仓库')
      })
      if (errMsg) {
        this.$message.error(errMsg)
        return
      }
      const formData = this.formData.map((item) => {
        return {
          material_name: item.material_name,
          material_attribute: item.material_attribute,
          vat_code: item.attr,
          color_code: item.colorDetail,
          store_id: item.store_id,
          client_name: item.client_name,
          weight: item.number,
          number: item.jianshu,
          action_type: item.type,
          complete_time: item.date,
          order_id: item.yarn_id
        }
      })
      yarnOutAndIn.create({
        data: formData
      }).then((res) => {
        console.log(res)
        if (res.data.status) {
          this.$message.success('添加成功')
          this.formData = []
          this.getDetail()
        }
      })
    },
    deleteLog (id) {
      this.$confirm('是否要删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnOutAndIn.delete({
          id: [id]
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDetail()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getDetail () {
      this.loading = true
      yarnOrder.detail({
        id: this.$route.params.id
      }).then((res) => {
        this.yarnOrderDetail = res.data.data
        this.yarnOrderDetail.material_info.forEach((item) => {
          item.logList = []
          this.yarnOrderDetail.stock_log.forEach((itemLog) => {
            if (itemLog.order_id === item.id) {
              item.logList.push(itemLog)
            }
          })
        })
        this.$forceUpdate()
        this.loading = false
      })
    }
  },
  mounted () {
    Promise.all([yarnOrder.detail({
      id: this.$route.params.id
    }), store.list({
      type: 2
    })]).then((res) => {
      console.log(res)
      this.yarnOrderDetail = res[0].data.data
      this.nameColorArr = res[0].data.data.material_info.map((item) => {
        return {
          name: item.material_name + '/' + item.material_attribute,
          id: item.id
        }
      })
      this.storeList = res[1].data.data
      this.yarnOrderDetail.material_info.forEach((item) => {
        item.logList = []
        item.in_weight = this.yarnOrderDetail.stock_log.reduce((total, current) => {
          if (current.action_type === 1 && item.material_name === current.material_name && item.material_attribute === current.material_attribute) {
            return total + current.weight
          }
          return total
        }, 0)
        this.yarnOrderDetail.stock_log.forEach((itemLog) => {
          if (itemLog.order_id === item.id) {
            item.logList.push(itemLog)
          }
        })
      })
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/yarnOrderDetail.less";
</style>
<style lang="less">
#yarnOrderDetail {
  .el-collapse-item__header {
    position: relative;
    min-height: 54px;
    display: flex;
    .el-collapse-item__arrow {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%) rotateZ(90deg);
      color: #1a95ff;
      &.is-active {
        transform: translateY(-50%) rotateZ(270deg);
      }
    }
  }
  .el-collapse-item__wrap {
    background-color: #f2f4f7;
  }
  .el-input__inner {
    height: 32px !important;
  }
}
</style>

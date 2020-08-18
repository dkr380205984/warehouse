<template>
  <div id="yarnOrderDetail"
    class="contentMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':type === 1}"
        @click="type !== 1 ? type = 1 : false">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaoruku"></use>
        </svg>
        <span class="name">物料入库</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === 2}"
        @click="type !== 2 ? type = 2 : false">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaochuku"></use>
        </svg>
        <span class="name">物料出库</span>
      </div>
      <div class="cut_item"
        :class="{'active':type === 3}"
        @click="type !== 3 ? type = 3 : false">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaohuiku"></use>
        </svg>
        <span class="name">物料回库</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">采购单信息</span>
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
        <template v-if="type === 1">
          <div class="btnCtn"
            style="display:flex;justify-content:flex-end;margin-bottom:8px">
            <div class="btn btnWhiteBlue"
              @click="printOrder">批量打印采购单</div>
          </div>
          <div class="tableCtnLv2">
            <div class="tb_header bigPadding">
              <span class="tb_row two_line"
                style="flex:0.3"></span>
              <span class="tb_row two_line">纱线名称</span>
              <span class="tb_row">单价</span>
              <span class="tb_row">颜色</span>
              <span class="tb_row">订购数量</span>
              <span class="tb_row">入库数量</span>
              <span class="tb_row">入库总价</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content bigPadding"
              v-for="(item,index) in material_info"
              :key="index">
              <span class="tb_row "
                style="flex:0.3">
                <el-checkbox v-model="item.check"></el-checkbox>
              </span>
              <span class="tb_row two_line">{{item.material_name}}</span>
              <span class="tb_row">{{item.price}}元</span>
              <span class="tb_row">{{item.material_attribute}}</span>
              <span class="tb_row"
                style="color:#1a95ff">{{item.weight}}{{item.unit}}</span>
              <span class="tb_row"
                style="color:#E6A23C">{{item.in_weight?item.in_weight:0}}{{item.unit}}</span>
              <span class="tb_row"
                style="color:#01B48C">{{item.in_weight?Number(item.price*item.in_weight):0}}元</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click.stop="addOpr(type,item.id,item.price,item.weight,item.material_name,item.material_attribute)">{{type === 1 ? '入' : type === 2 ? '出' : '回'}}库</span>
                <!-- <span class="tb_handle_btn blue"
                v-else-if="type === 2"
                @click.stop="addOpr(2,item.id,item.price,item.weight,item.material_name,item.material_attribute)">出库</span>
              <span class="tb_handle_btn blue"
                v-else-if="type === 3"
                @click.stop="addOpr(3,item.id,item.price,item.weight,item.material_name,item.material_attribute)">回库</span> -->
              </span>
            </div>
            <!-- <el-collapse>
            <el-collapse-item>
              <div slot="title"
                class="tb_collapse tb_content bigPadding">
                <span class="tb_row two_line"
                  style="flex:0.3">
                  <el-checkbox v-model="item.check"></el-checkbox>
                </span>
                <span class="tb_row two_line">{{item.material_name}}</span>
                <span class="tb_row">{{item.price}}元</span>
                <span class="tb_row">{{item.material_attribute}}</span>
                <span class="tb_row"
                  style="color:#1a95ff">{{item.weight}}{{item.unit}}</span>
                <span class="tb_row"
                  style="color:#E6A23C">{{item.in_weight?item.in_weight:0}}{{item.unit}}</span>
                <span class="tb_row"
                  style="color:#01B48C">{{item.in_weight?Number(item.price*item.in_weight):0}}元</span>
                <span class="tb_row middle">
                  <span class="tb_handle_btn blue"
                    v-if="type === 1"
                    @click.stop="addOpr(1,item.id,item.price,item.weight,item.material_name,item.material_attribute)">入库</span>
                  <span class="tb_handle_btn blue"
                    v-else-if="type === 2"
                    @click.stop="addOpr(2,item.id,item.price,item.weight,item.material_name,item.material_attribute)">出库</span>
                  <span class="tb_handle_btn blue"
                    v-else-if="type === 3"
                    @click.stop="addOpr(3,item.id,item.price,item.weight,item.material_name,item.material_attribute)">回库</span>
                </span>
              </div>
              <div class="tableCtnLv2">
                <div class="tb_header noBgColor bigPadding">
                  <span class="tb_row"
                    style="flex:0.3"></span>
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
                  <span class="tb_row"
                    style="flex:0.3">
                    <el-checkbox v-model="itemChild.check"></el-checkbox>
                  </span>
                  <span class="tb_row">{{itemChild.vat_code||'/'}}</span>
                  <span class="tb_row">{{itemChild.color_code||'/'}}</span>
                  <span class="tb_row">{{itemChild.action_type===1?'入库':itemChild.action_type===2?'出库':'回库'}}</span>
                  <span class="tb_row">{{itemChild.weight||'0'}}{{itemChild.unit}}</span>
                  <span class="tb_row">{{itemChild.number}}件</span>
                  <span class="tb_row">{{itemChild.weight?itemChild.weight*item.price:0}}元</span>
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
                    <span class="tb_handle_btn blue"
                      style="padding:0 5px 0 0;visibility:hidden"
                      v-if="itemChild.action_type===3">出库</span>
                    <span class="tb_handle_btn orange"
                      style="padding:0 5px 0 0"
                      v-if="itemChild.action_type===1"
                      @click.stop="openWin('/print/goStockTable/' + $route.params.id + '?logId=' + itemChild.id)">打印</span>
                    <span class="tb_handle_btn orange"
                      style="padding:0 5px 0 0"
                      v-if="itemChild.action_type===2"
                      @click.stop="openWin('/print/outStockTable/' + $route.params.id + '?logId=' + itemChild.id)">打印</span>
                    <span class="tb_handle_btn orange"
                      style="padding:0 5px 0 0"
                      v-if="itemChild.action_type===3"
                      @click.stop="openWin('/print/backStockTable/' + $route.params.id + '?logId=' + itemChild.id)">打印</span>
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
          </el-collapse> -->
          </div>
        </template>
        <template v-else>
          <div class="tableCtnLv2">
            <div class="tb_header">
              <span class="tb_row">物料名称</span>
              <span class="tb_row">颜色/属性</span>
              <span class="tb_row">批/缸号</span>
              <span class="tb_row">色号</span>
              <span class="tb_row">数量</span>
              <span class="tb_row">件数</span>
              <span class="tb_row">仓库</span>
              <span class="tb_row"
                v-if="type == 3">出库单位</span>
              <span class="tb_row">{{type === 2 ? '入' : '出'}}库时间</span>
              <span class="tb_row middle">操作</span>
            </div>
            <div class="tb_content"
              v-for="(item,index) in material_info"
              :key="index">
              <span class="tb_row">{{item.material_name}}</span>
              <span class="tb_row">{{item.material_attribute}}</span>
              <span class="tb_row">{{item.vat_code || '/'}}</span>
              <span class="tb_row">{{item.color_code || '/'}}</span>
              <span class="tb_row"
                style="color:#01B48C">{{item.weight}}</span>
              <span class="tb_row">{{item.number}}</span>
              <span class="tb_row">{{item.store_name}}</span>
              <span class="tb_row"
                v-if="type === 3">{{item.client_name}}</span>
              <span class="tb_row">{{item.complete_time}}</span>
              <span class="tb_row middle">
                <span class="tb_handle_btn blue"
                  @click.stop="addOpr(type,item.order_id,item.price,item.weight,item.material_name,item.material_attribute,item.vat_code,item.color_code,item.store_id)">{{type === 2 ? '出' : '回'}}库</span>
              </span>
            </div>
          </div>
        </template>
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
                <span class="inputspan">{{item.number?Number(item.number*item.price):0}}元</span>
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">物料{{type === 1 ? '入库' : type === 2 ? '出库' : '回库'}}日志</span>
      </div>
      <div class="listCtn"
        style="border-top:none">
        <div class="btnCtn"
          style="display:flex;justify-content:flex-end;margin-bottom:8px">
          <div class="btn btnWhiteBlue"
            @click="printAll">批量打印{{type === 1 ? '入库' : type === 2 ? '出库' : '回库'}}单</div>
        </div>
        <div class="tableCtnLv2">
          <div class="tb_header">
            <span class="tb_row"
              style="flex:0.3">
              <el-checkbox v-model="checkedAll"
                @change="checkedAllLog"></el-checkbox>
            </span>
            <span class="tb_row">物料名称</span>
            <span class="tb_row">颜色/属性</span>
            <span class="tb_row">批/缸号</span>
            <span class="tb_row">色号</span>
            <span class="tb_row">数量</span>
            <span class="tb_row">件数</span>
            <span class="tb_row">仓库</span>
            <span class="tb_row"
              v-if="type !== 1">{{type === 2 ? '出库' : '回库'}}单位</span>
            <span class="tb_row">{{type === 1 ? '入' : type === 2 ? '出' : '回'}}库总价</span>
            <span class="tb_row">{{type === 1 ? '入' : type === 2 ? '出' : '回'}}库时间</span>
            <span class="tb_row">备注</span>
            <span class="tb_row">操作人</span>
            <span class="tb_row middle">操作</span>
          </div>
          <div class="tb_content"
            v-for="(itemLog,indexLog) in stockLog"
            :key="indexLog">
            <span class="tb_row"
              style="flex:0.3">
              <el-checkbox v-model="itemLog.checked"
                @change="$forceUpdate()"></el-checkbox>
            </span>
            <span class="tb_row">{{itemLog.material_name}}</span>
            <span class="tb_row">{{itemLog.material_attribute}}</span>
            <span class="tb_row">{{itemLog.vat_code}}</span>
            <span class="tb_row">{{itemLog.color_code}}</span>
            <span class="tb_row">{{itemLog.weight}}</span>
            <span class="tb_row">{{itemLog.number}}</span>
            <span class="tb_row">{{itemLog.store_name}}</span>
            <span class="tb_row"
              v-if="type !== 1">{{itemLog.client_name}}</span>
            <span class="tb_row">{{itemLog.total_price}}</span>
            <span class="tb_row">{{itemLog.complete_time}}</span>
            <span class="tb_row">{{itemLog.desc}}</span>
            <span class="tb_row">{{itemLog.user_name}}</span>
            <span class="tb_row middle">
              <span class="tb_handle_btn orange"
                @click.stop="openWin(`/print/${type === 1 ? 'go' : type === 2 ? 'out' : 'back'}StockTable/${$route.params.id}?logId=${itemLog.id}`)">打印</span>
              <span class="tb_handle_btn red"
                @click="deleteLog(itemLog.id)">删除</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomFixBar">
      <div class="main">
        <div class="btnCtn">
          <div class="btn btnGray"
            @click="$router.go(-1)">返回</div>
          <!-- <div class="btn btnBlue"
            @click="printOrder">批量打印采购单</div>
          <div class="btn btnBlue"
            @click="printAll">批量打印出入库</div> -->
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
      },
      material_info: [],
      type: 1, // 1入库2出库3回库
      stockLog: [],
      checkedAll: false
    }
  },
  watch: {
    type (newVal) {
      this.cutType(this.yarnOrderDetail)
    }
  },
  methods: {
    checkedAllLog (e) {
      this.stockLog.forEach(item => {
        item.checked = e
      })
      this.$forceUpdate()
    },
    openWin (url) {
      window.open(url)
    },
    printOrder () {
      const idArr = this.material_info.filter((item) => item.check).map((item) => item.id)
      if (idArr.length === 0) {
        this.$message.error('请选择采购单')
        return
      }
      window.open('/print/orderYarnTable/' + this.$route.params.id + '?logId=' + idArr.join('-'))
    },
    printAll () {
      const idArr = {
        in: [],
        out: [],
        back: []
      }
      this.stockLog.forEach((item) => {
        // item.logList.forEach((itemChild) => {
        if (item.checked) {
          if (item.action_type === 1) {
            idArr.in.push(item.id)
          }
          if (item.action_type === 2) {
            idArr.out.push(item.id)
          }
          if (item.action_type === 3) {
            idArr.back.push(item.id)
          }
        }
        // })
      })
      if (idArr.in.length === 0 && idArr.out.length === 0 && idArr.back.length === 0) {
        this.$message.error('请选择需要打印的日志')
        return
      }
      if ((idArr.in.length > 0 && idArr.out.length > 0) || (idArr.in.length > 0 && idArr.back.length > 0) || (idArr.out.length > 0 && idArr.back.length > 0)) {
        this.$message.error('请选择同一类型的日志进行打印')
        return
      }
      if (idArr.in.length > 0) {
        window.open('/print/goStockTable/' + this.$route.params.id + '?logId=' + idArr.in.join('-'), '_blank')
      }
      if (idArr.out.length > 0) {
        window.open('/print/outStockTable/' + this.$route.params.id + '?logId=' + idArr.out.join('-'), '_blank')
      }
      if (idArr.back.length > 0) {
        window.open('/print/backStockTable/' + this.$route.params.id + '?logId=' + idArr.back.join('-'), '_blank')
      }
    },
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
          order_id: item.yarn_id,
          material_type: this.yarnOrderDetail.order_type // 物料类型跟采购单类型一样
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
            item.in_weight = this.yarnOrderDetail.stock_log.reduce((total, current) => {
              if (current.action_type === 1 && item.material_name === current.material_name && item.material_attribute === current.material_attribute) {
                return total + current.weight
              }
              return total
            }, 0)
            if (itemLog.order_id === item.id) {
              item.logList.push(itemLog)
            }
          })
        })
        this.cutType(this.yarnOrderDetail)
        this.$forceUpdate()
        this.loading = false
      })
    },
    cutType (data) {
      this.formData = []
      if (this.type === 1) {
        this.stockLog = data.stock_log.filter(itemF => itemF.action_type === 1)
        this.material_info = data.material_info
      } else if (this.type === 2) {
        this.stockLog = data.stock_log.filter(itemF => itemF.action_type === 2)
        this.material_info = data.stock_log.filter(itemF => itemF.action_type === 1)
      } else if (this.type === 3) {
        this.stockLog = data.stock_log.filter(itemF => itemF.action_type === 3)
        this.material_info = data.stock_log.filter(itemF => itemF.action_type === 2)
      } else {
        this.$message.error('未知错误，请刷新页面重试')
      }
    },
    init () {
      Promise.all([
        yarnOrder.detail({
          id: this.$route.params.id
        }),
        store.list({
          type: 2
        })
      ]).then((res) => {
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
        this.cutType(this.yarnOrderDetail)
        this.loading = false
      })
    }
  },
  mounted () {
    this.init()
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

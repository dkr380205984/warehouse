<template>
  <div id="yarnStoreDetail"
    class="contentMain">
    <div class="searchCtn">
      <div class="title">搜索物料名称，查询物料库存信息</div>
      <el-autocomplete class="inline-input"
        :fetch-suggestions="searchYarn"
        placeholder="请输入物料名称查询"
        @select="selectYarn">
        <template slot="append">
          <span class="btn btnBlue"
            @click="searchYarn">搜索</span>
        </template>
      </el-autocomplete>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">搜索物料列表</span>
      </div>
      <div class="editCtn">
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="flexTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">颜色属性</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">缸号/批号</div>
                      <div class="tcolumn">色号</div>
                      <div class="tcolumn">库存数量</div>
                      <div class="tcolumn">更新日期</div>
                      <div class="tcolumn">仓库/货架</div>
                      <div class="tcolumn">操作</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">颜色属性</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow">
                      <div class="tcolumn">缸号/批号</div>
                      <div class="tcolumn">色号</div>
                      <div class="tcolumn">库存数量</div>
                      <div class="tcolumn">更新日期</div>
                      <div class="tcolumn">仓库/货架</div>
                      <div class="tcolumn">
                        <span class="tb_row middle">
                          <!-- <span class="tb_handle_btn blue"
                            @click.stop="addOpr(1,item.id,item.price,item.weight,item.material_name,item.material_attribute,item.vat_code,item.color_code)">入库</span>
                          <span class="tb_handle_btn blue"
                            @click.stop="addOpr(2,item.id,item.price,item.weight,item.material_name,item.material_attribute,item.vat_code,item.color_code)">出库</span>
                          <span class="tb_handle_btn blue"
                            @click.stop="addOpr(3,item.id,item.price,item.weight,item.material_name,item.material_attribute,item.vat_code,item.color_code)">回库</span> -->
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">出入库日志</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="storeName"
              @change="getStoreLogList"
              placeholder="请输入物料名称查询"></el-input>
            <el-autocomplete class="inputs"
              v-model="clientName"
              :fetch-suggestions="querySearchClient"
              @change="getStoreLogList"
              placeholder="请输入出入库单位查询"></el-autocomplete>
            <el-date-picker class="inputs"
              v-model="storeDate"
              type="date"
              value-format="yyyy-MMM-dd"
              @change="getStoreLogList"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnBlue"
              style="margin-left:0px"
              @click="getStoreLogList">搜索</div>
            <div class="btn btnGray"
              style="margin-left:12px"
              @click="reset">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn noBorder"
              @click="deleteLog(null,true)">批量删除</div>
            <div class="btn noBorder"
              @click="download">批量导出</div>
          </div>
        </div>
        <div class="rowCtn">
          <div class="colCtn"
            style="margin-right:0">
            <div class="normalTb">
              <div class="thead">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="checkAll"
                      @change="checkAllLog"></el-checkbox>
                  </div>
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">缸号/批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">库存量</div>
                  <div class="tcolumn">更新日期</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="checkAll"
                      @change="checkAllLog"></el-checkbox>
                  </div>
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">缸号/批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">库存量</div>
                  <div class="tcolumn">更新日期</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="totalStoreLog"
            :current-page.sync="pageStoreLog"
            @current-change="getStoreLogList">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formCheck, downloadExcel } from '@/assets/js/common.js'
import { yarnStore, yarnOutAndIn } from '@/assets/js/api.js'
export default {
  data () {
    return {
      state: '',
      formData: [],
      checkAll: false,
      storeName: '',
      clientName: '',
      storeDate: '',
      pageStoreLog: 1,
      totalStoreLog: 1,
      materialList: []
    }
  },
  methods: {
    // 批量导出excel
    download () {
      const data = this.storeLogList.filter(item => item.check)
      data.forEach((item) => {
        item.action_type = this.actionArr[item.action_type]
        item.totalPrice = Number(item.price * item.number)
        item.product_code = item.product_info.product_code
        item.product_name = item.product_info.name
        item.style_code = item.product_info.style_code
        item.size_color = item.size_info.size_name + '/' + item.size_info.color_name
        item.time = item.created_at.date.slice(0, 10)
      })
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      downloadExcel(data, [
        { title: '产品编号', key: 'product_code' },
        { title: '产品名称', key: 'product_name' },
        { title: '款号', key: 'style_code' },
        { title: '尺码颜色', key: 'size_color' },
        { title: '单价', key: 'price' },
        { title: '数量', key: 'number' },
        { title: '总价', key: 'totalPrice' },
        { title: '操作类型', key: 'action_type' },
        { title: '出入库单位', key: 'client_name' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' },
        { title: '操作时间', key: 'time' }
      ], this.orderInfo)
    },
    searchYarn (queryString, cb) {
      const json = [{ value: '33', address: '3333' }]
      yarnStore.list({
        material_name: queryString
      }).then((res) => {
        console.log(res)
        cb(json)
      })
    },
    selectYarn (item) {
      this.searchValue = item
    },
    querySearchClient (queryString, cb) {

    },
    deleteData (index) {
      this.formData.splice(index, 1)
    },
    addOpr (type, id, price, weight, name, color, ganghao, sehao) {
      this.formData.push({
        yarn_id: '',
        material_name: name || '',
        client_name: '',
        material_attribute: color || '',
        attr: ganghao || '',
        colorDetail: sehao || '',
        number: '',
        weight: weight || 0,
        jianshu: '',
        store_id: '',
        price: price || 0,
        date: (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1 < 10 ? '0' + ((new Date()).getMonth() + 1) : (new Date()).getMonth() + 1) + '-' + ((new Date()).getDate() < 10 ? '0' + (new Date()).getDate() : (new Date()).getDate()),
        type: type,
        desc: ''
      })
    },
    cancle () {
      this.formData = []
    },
    reset () {

    },
    getStoreLogList () {

    },
    checkAllLog () {

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
          order_id: item.yarn_id // 这个应该是空字符串
        }
      })
      yarnOutAndIn.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.formData = []
          this.getStoreLogList()
        }
      })
    }
  },
  mounted () {
    yarnStore.list({
      material_name: ''
    }).then((res) => {
      this.materialList = res.data.data
    })
  }
}
</script>
<style lang="less" scoped>
@import "~@/assets/less/yarnStoreDetail.less";
</style>
<style lang="less">
#yarnStoreDetail {
  .el-input-group__append {
    padding: 0;
    border: 0;
  }
}
</style>

<template>
  <div id="yarnStoreDetail"
    class="contentMain"
    v-loading="loading">
    <div class="searchCtn">
      <div class="title">搜索物料名称，查询物料库存信息</div>
      <el-autocomplete class="inline-input"
        v-model="searchYarnValue"
        :fetch-suggestions="searchYarn"
        placeholder="请输入物料名称查询"
        @select="selectYarn">
        <template slot="append">
          <span class="btn btnBlue"
            @click="searchYarn">搜索</span>
        </template>
        <template slot="prepend">
          <el-select class="prependSel"
            v-model="searchType"
            style="width:150px">
            <el-option label="搜索原料"
              value="1"></el-option>
            <el-option label="搜索辅料"
              value="2"></el-option>
          </el-select>
        </template>
      </el-autocomplete>
    </div>
    <div class="module"
      v-if="searchList.length>0">
      <div class="titleCtn">
        <span class="title">搜索物料列表</span>
        <div class="btn btnBlue"
          @click="filterMat"
          v-if="searchType==='1'">去除小于一公斤</div>
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
                <div class="trow"
                  v-for="(item,index) in searchList"
                  :key="index">
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_attribute}}</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.vat_code}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.total_weight}}kg</div>
                      <div class="tcolumn">{{itemChild.update_time.slice(0,10)}}</div>
                      <div class="tcolumn">{{itemChild.store_name}}</div>
                      <div class="tcolumn">
                        <span style="display:flex">
                          <!-- <span style="color:#1a95ff;padding:0 6px;cursor:pointer"
                            @click.stop="addOpr(1,'','',itemChild.total_weight,item.material_name,item.material_attribute,itemChild.vat_code,itemChild.color_code)">入库</span> -->
                          <span style="color:#1a95ff;padding:0 6px;cursor:pointer"
                            @click.stop="addOpr(2,'','',itemChild.total_weight,item.material_name,item.material_attribute,itemChild.vat_code,itemChild.color_code)">出库</span>
                          <span style="color:#1a95ff;padding:0 6px;cursor:pointer"
                            @click.stop="addOpr(3,'','',itemChild.total_weight,item.material_name,item.material_attribute,itemChild.vat_code,itemChild.color_code)">回库</span>
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
                    </div>
                    <div class="content">
                      <span class="inputspan">{{item.material_name + '/' + item.material_attribute}}</span>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">批次/缸号</span>
                    </div>
                    <div class="content">
                      <span class="inputspan">{{item.attr}}</span>
                    </div>
                  </div>
                  <div class="colCtn">
                    <div class="label">
                      <span class="text">色号</span>
                    </div>
                    <div class="content">
                      <span class="inputspan">{{item.colorDetail}}</span>
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
        <el-switch v-model="materialType"
          @change="getStoreLogList"
          active-color="#1a95ff"
          inactive-color="#E6A23C"
          active-text="原料"
          inactive-text="辅料">
        </el-switch>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="storeName"
              @change="getStoreLogList"
              placeholder="物料名称"></el-input>
            <el-autocomplete class="inputs"
              v-model="clientName"
              :fetch-suggestions="querySearchClient"
              @change="getStoreLogList"
              placeholder="出入库单位"></el-autocomplete>
            <el-autocomplete class="inputs"
              v-model="orderClient"
              :fetch-suggestions="querySearchClient"
              @change="getStoreLogList"
              placeholder="采购单位"></el-autocomplete>
            <el-select class="inputs"
              v-model="type"
              @change="getStoreLogList"
              placeholder="操作类型">
              <el-option label="全部"
                value="0"></el-option>
              <el-option label="入库"
                value="1"></el-option>
              <el-option label="出库"
                value="2"></el-option>
              <el-option label="回库"
                value="3"></el-option>
            </el-select>
            <el-date-picker style="width:220px;margin-right:12px"
              v-model="storeDate"
              type="daterange"
              value-format="yyyy-MM-dd"
              @change="getStoreLogList"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
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
              @click="deleteLog(false)">批量删除</div>
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
                  <div class="tcolumn">订单信息</div>
                  <div class="tcolumn">操作类型</div>
                  <div class="tcolumn">物料名称</div>
                  <div class="tcolumn">物料属性</div>
                  <div class="tcolumn">缸号/批号</div>
                  <div class="tcolumn">色号</div>
                  <div class="tcolumn">单价</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">采购单位</div>
                  <div class="tcolumn">仓库</div>
                  <div class="tcolumn">出/回库单位</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">更新日期</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in materialList"
                  :key="item.id">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"
                      @change="updateAll"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.order_code}}</div>
                  <div class="tcolumn"
                    :style="item.action_type===1 ? 'color:#1a95ff':item.action_type===2?'color:rgb(1, 180, 140)':item.action_type===3?'color:rgb(245, 34, 45)':''">{{item.action_type===1?'入库':item.action_type===2?'出库':'回库'}}</div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_attribute}}</div>
                  <div class="tcolumn">{{item.vat_code}}</div>
                  <div class="tcolumn">{{item.color_code}}</div>
                  <div class="tcolumn"
                    style="color:#1a95ff">{{item.price}}元</div>
                  <div class="tcolumn"
                    style="color:#1a95ff">{{item.weight}}kg</div>
                  <div class="tcolumn">{{item.order_client}}</div>
                  <div class="tcolumn">{{item.store_name}}</div>
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn">{{item.user_name}}</div>
                  <div class="tcolumn">{{item.complete_time}}</div>
                  <div class="tcolumn">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id)">删除</span>
                  </div>
                </div>
              </div>
              <div class="total">
                <div class="once"
                  v-if="Number(materialType)===1">
                  <span class="label">合计数量：</span>
                  <span class="number">{{totalWeight}}kg</span>
                </div>
                <div class="once">
                  <span class="label">合计价格：</span>
                  <span class="number">{{totalNumber}}元</span>
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
    <div class="module">
      <div class="titleCtn">
        <span class="title">所有原料库存</span>
        <div class="btn btnBlue"
          @click="filterAllMat">去除小于一公斤</div>
      </div>
      <div class="editCtn listCtn">
        <div class="filterCtn"
          style="padding-right:24px">
          <div class="leftCtn"></div>
          <div class="leftCtn">
            <!-- <div class="btn noBorder">打印库存</div> -->
            <div class="btn noBorder"
              @click="downloadAll">导出库存excel</div>
          </div>
        </div>
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
                      <!-- <div class="tcolumn">操作</div> -->
                    </div>
                  </div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in allMatList"
                  :key="index">
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_attribute}}</div>
                  <div class="tcolumn noPad"
                    style="flex:5">
                    <div class="trow"
                      v-for="(itemChild,indexChild) in item.childrenMergeInfo"
                      :key="indexChild">
                      <div class="tcolumn">{{itemChild.vat_code}}</div>
                      <div class="tcolumn">{{itemChild.color_code}}</div>
                      <div class="tcolumn">{{itemChild.total_weight}}kg</div>
                      <div class="tcolumn">{{itemChild.update_time.slice(0,10)}}</div>
                      <div class="tcolumn">{{itemChild.store_name}}</div>
                      <!-- <div class="tcolumn">
                        <span style="display:flex">
                          <span style="color:#1a95ff;padding:0 6px;cursor:pointer">打印</span>
                        </span>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formCheck, downloadExcel, mergeData } from '@/assets/js/common.js'
import { yarnStore, yarnOutAndIn, store } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      materialType: true,
      searchYarnValue: '',
      formData: [],
      checkAll: false,
      storeName: '',
      clientName: '',
      orderClient: '',
      storeDate: '',
      pageStoreLog: 1,
      totalStoreLog: 1,
      materialList: [],
      searchList: [],
      storeList: [],
      localYarnclientArr: [],
      localYarnnameArr: [],
      type: '0',
      totalWeight: 0,
      totalNumber: 0,
      searchType: '1',
      allMatList: [],
      allMatDownLoad: []
    }
  },
  methods: {
    updateAll () {
      this.$forceUpdate()
    },
    filterMat () {
      this.loading = true
      yarnStore.list({
        material_name: this.searchYarnValue,
        material_type: Number(this.searchType)
      }).then((res) => {
        this.searchList = mergeData(res.data.data.filter((item) => item.total_weight > 1), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
        this.loading = false
      })
    },
    filterAllMat () {
      this.loading = true
      yarnStore.list({
        material_name: '',
        material_type: 1
      }).then((res) => {
        this.allMatDownLoad = res.data.data.filter((item) => item.total_weight > 1)
        this.allMatList = mergeData(res.data.data.filter((item) => item.total_weight > 1), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
        this.loading = false
      })
    },
    downloadAll () {
      const data = this.allMatDownLoad
      data.forEach((item) => {
        item.time = item.update_time.slice(0, 10)
      })
      downloadExcel(data, [
        { title: '物料名称', key: 'material_name' },
        { title: '颜色属性', key: 'material_attribute' },
        { title: '批号/缸号', key: 'vat_code' },
        { title: '色号', key: 'material_attribute' },
        { title: '数量', key: 'total_weight' },
        { title: '仓库', key: 'store_name' },
        { title: '更新日期', key: 'time' }
      ])
    },
    // 批量导出excel
    download () {
      const data = this.materialList.filter(item => item.check)
      const actionArr = ['', '入库', '出库', '回库']
      data.forEach((item) => {
        item.actionType = actionArr[item.action_type]
        item.totalPrice = Number(item.price * item.weight)
      })
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      downloadExcel(data, [
        { title: '订单信息', key: 'order_code' },
        { title: '操作类型', key: 'actionType' },
        { title: '物料名称', key: 'material_name' },
        { title: '物料属性', key: 'material_attribute' },
        { title: '缸号/批号', key: 'vat_code' },
        { title: '色号', key: 'color_code' },
        { title: '单价', key: 'price' },
        { title: '数量', key: 'weight' },
        { title: '总价', key: 'totalPrice' },
        { title: '仓库', key: 'store_name' },
        { title: '出/回库单位', key: 'client_name' },
        { title: '备注', key: 'desc' },
        { title: '操作人', key: 'user_name' },
        { title: '操作时间', key: 'complete_time' }
      ])
    },
    searchYarn (queryString, cb) {
      yarnStore.nameList({
        material_name: queryString,
        material_type: Number(this.searchType)
      }).then((res) => {
        cb(res.data.data.map((item) => {
          return {
            value: item,
            name: item
          }
        }))
      })
    },
    selectYarn (str) {
      this.loading = true
      yarnStore.list({
        material_name: str.value
      }).then((res) => {
        this.searchList = mergeData(res.data.data.filter((item) => item.total_weight > 0), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
        this.loading = false
      })
    },
    querySearchClient (queryString, cb) {
      cb(queryString ? this.addValue(this.localYarnclientArr.filter(this.createFilter(queryString))) : this.addValue(this.localYarnclientArr))
    },
    querySearchYarn (queryString, cb) {
      cb(queryString ? this.addValue(this.localYarnnameArr.filter(this.createFilter(queryString))) : this.addValue(this.localYarnnameArr))
    },
    createFilter (queryString) {
      return (obj) => {
        return (obj.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    deleteData (index) {
      this.formData.splice(index, 1)
    },
    // 能把数组转为对象数组
    addValue (arr) {
      return arr.map((item) => {
        return {
          value: item
        }
      })
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
      this.storeDate = ''
      this.pageStoreLog = 1
      this.storeName = ''
      this.clientName = ''
      this.orderClient = ''
      this.type = '0'
      this.getStoreLogList()
    },
    deleteLog (id) {
      this.$confirm('是否要删除该日志?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (id) {
          yarnOutAndIn.delete({
            id: [id]
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getStoreLogList()
            }
          })
        } else {
          yarnOutAndIn.delete({
            id: this.materialList.filter((item) => item.check).map((item) => item.id)
          }).then((res) => {
            if (res.data.status) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getStoreLogList()
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getStoreLogList () {
      this.loading = true
      yarnStore.log({
        limit: 10,
        page: this.pageStoreLog,
        client_name: this.clientName,
        material_name: this.storeName,
        start_time: this.storeDate[0],
        end_time: this.storeDate[1],
        order_client: this.orderClient,
        action_type: Number(this.type),
        material_type: this.materialType ? 1 : 2
      }).then((res) => {
        this.materialList = res.data.data
        this.totalStoreLog = res.data.meta.total
        this.totalWeight = res.data.total_weight
        this.totalNumber = res.data.total_price
        this.$forceUpdate()
        this.loading = false
      })
    },
    checkAllLog (flag) {
      this.materialList.forEach((item) => {
        item.check = flag
      })
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
          material_type: Number(this.searchType),
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
      this.loading = true
      yarnOutAndIn.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('操作成功')
          this.formData = []
          this.getStoreLogList()
          yarnStore.list({
            material_name: this.searchYarnValue
          }).then((res) => {
            this.searchList = mergeData(res.data.data.filter((item) => item.total_weight > 0), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
            this.loading = false
          })
        }
      })
    }
  },
  mounted () {
    this.localYarnclientArr = JSON.parse(window.localStorage.getItem('yarnclient')) || []
    this.localYarnnameArr = JSON.parse(window.localStorage.getItem('yarnname')) || []
    this.getStoreLogList()
    store.list({
      type: 2
    }).then((res) => {
      this.storeList = res.data.data
    })
    yarnStore.list({
      material_name: '',
      material_type: 1
    }).then((res) => {
      this.allMatDownLoad = res.data.data.filter((item) => item.total_weight > 0)
      this.allMatList = mergeData(res.data.data.filter((item) => item.total_weight > 0), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
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
  .prependSel {
    background: #fff;
    height: 36px !important;
    .el-input__inner {
      border: 0;
    }
  }
}
</style>

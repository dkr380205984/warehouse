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
      </el-autocomplete>
    </div>
    <div class="module"
      v-if="searchList.length>0">
      <div class="titleCtn">
        <span class="title">搜索物料列表</span>
        <div class="btn btnBlue"
          @click="filterMat">去除小于一公斤</div>
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
                      <div class="tcolumn">{{itemChild.update_time.date.slice(0,10)}}</div>
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
                  <div class="tcolumn">仓库</div>
                  <div class="tcolumn">出/回库单位</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">更新日期</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="(item,index) in materialList"
                  :key="index">
                  <div class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </div>
                  <div class="tcolumn">{{item.order_code}}</div>
                  <div class="tcolumn"
                    :style="item.action_type===1 ? 'color:#1a95ff':item.action_type===2?'color:rgb(1, 180, 140)':item.action_type===3?'color:rgb(245, 34, 45)':''">{{item.action_type===1?'入库':item.action_type===2?'出库':'回库'}}</div>
                  <div class="tcolumn">{{item.material_name}}</div>
                  <div class="tcolumn">{{item.material_attribute}}</div>
                  <div class="tcolumn">{{item.vat_code}}</div>
                  <div class="tcolumn">{{item.color_code}}</div>
                  <div class="tcolumn">{{item.price}}元</div>
                  <div class="tcolumn">{{item.weight}}kg</div>
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
import { formCheck, downloadExcel, mergeData } from '@/assets/js/common.js'
import { yarnStore, yarnOutAndIn, store } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      searchYarnValue: '',
      formData: [],
      checkAll: false,
      storeName: '',
      clientName: '',
      storeDate: '',
      pageStoreLog: 1,
      totalStoreLog: 1,
      materialList: [],
      searchList: [],
      storeList: []
    }
  },
  methods: {
    filterMat () {
      this.loading = true
      yarnStore.list({
        material_name: this.searchYarnValue
      }).then((res) => {
        this.searchList = mergeData(res.data.data.filter((item) => item.total_weight > 1), { mainRule: 'material_attribute', otherRule: [{ name: 'material_name' }] })
        this.loading = false
      })
    },
    // 批量导出excel
    download () {
      const data = this.materialList.filter(item => item.check)
      const actionArr = ['', '入库', '出库', '回库']
      data.forEach((item) => {
        item.action_type = actionArr[item.action_type]
        item.totalPrice = Number(item.price * item.number)
      })
      if (data.length === 0) {
        this.$message.error('请选择需要导出的日志')
        return
      }
      downloadExcel(data, [
        { title: '订单信息', key: 'product_code' },
        { title: '操作类型', key: 'action_type' },
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
      ], this.orderInfo)
    },
    searchYarn (queryString, cb) {
      yarnStore.nameList({
        material_name: queryString
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
      this.storeDate = ''
      this.pageStoreLog = 1
      this.storeName = ''
      this.clientName = ''
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
    getStoreLogList () {
      this.loading = true
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      yarnStore.log({
        limit: 10,
        page: this.pageStoreLog,
        client_name: this.clientName,
        material_name: this.storeName,
        start_time: this.storeDate,
        end_time: y + '-' + m + '-' + d
      }).then((res) => {
        this.materialList = res.data.data
        this.totalStoreLog = res.data.meta.total
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
    this.getStoreLogList()
    store.list({
      type: 2
    }).then((res) => {
      this.storeList = res.data.data
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

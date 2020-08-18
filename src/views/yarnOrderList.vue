<template>
  <div id="yarnOrderList"
    class="contentMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item active">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaodinggou"></use>
        </svg>
        <span class="name">{{type === '1' ? '原' : '辅'}}料采购列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/yarnStoreDetail/${type}/1`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-chanpin"></use>
        </svg>
        <span class="name">{{type === '1' ? '原' : '辅'}}料库存列表</span>
      </div>
      <div class="cut_item"
        @click="$router.push(`/yarnStoreDetail/${type}/2`)">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-jincangdan"></use>
        </svg>
        <span class="name">{{type === '1' ? '原' : '辅'}}料库存日志</span>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn rightBtn">
        <span class="title">采购单列表</span>
        <span class="btn btnWhiteBlue"
          @click="$router.push(type === '1' ? '/yarnOrderCreate' : '/materialOrderCreate')">添加{{type === '1' ? '原' : '辅'}}料采购单</span>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="orderCode"
              @change="changeRouter(1)"
              placeholder="搜索订单号">
            </el-input>
            <el-input class="inputs"
              v-model="yarnName"
              @change="changeRouter(1)"
              placeholder="搜索纱线名称">
            </el-input>
            <el-input class="inputs"
              v-model="clientName"
              @change="changeRouter(1)"
              placeholder="搜索公司名称">
            </el-input>
            <!-- <el-select class="inputs"
              v-model="type"
              @change="changeRouter(1)"
              placeholder="采购单类型">
              <el-option value="0"
                label="全部"></el-option>
              <el-option value="1"
                label="原料采购单"></el-option>
              <el-option value="2"
                label="辅料采购单"></el-option>
            </el-select> -->
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset">重置</div>
          </div>
          <div class="rightCtn">
            <el-switch v-model="mode"
              active-text="列表模式"
              inactive-text="表格模式">
            </el-switch>
          </div>
        </div>
        <div class="list"
          v-if="mode">
          <div class="title">
            <div class="col">
              <span class="text">系统编号</span>
            </div>
            <div class="col">
              <span class="text">订单号</span>
            </div>
            <div class="col">
              <span class="text">公司名称</span>
            </div>
            <div class="col">
              <span class="text">包含物料</span>
            </div>
            <div class="col">
              <span class="text">订购总数</span>
            </div>
            <div class="col">
              <span class="text">入库统计</span>
            </div>
            <div class="col">
              <span class="text">出库统计</span>
            </div>
            <div class="col">
              <span class="text">订购日期</span>
            </div>
            <div class="col"
              style="flex:1.2">
              <span class="text">操作</span>
            </div>
          </div>
          <div class="row"
            v-for="(item,index) in list"
            :key="index">
            <div class="col">
              <span class="text">{{item.inside_code}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.order_code}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.client_name}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.material_info|getAllMat}}</span>
            </div>
            <div class="col">
              <span class="text"
                style="color:#1a95ff">{{item.material_info|totalWeight}}{{item.order_type===1?'kg':''}}</span>
            </div>
            <div class="col">
              <span class="text"
                style="color:#E6A23C">{{item.stock_log|totalInWeight}}{{item.order_type===1?'kg':''}}</span>
            </div>
            <div class="col">
              <span class="text"
                style="color:#01B48C">{{item.stock_log|totalOutWeight}}{{item.order_type===1?'kg':''}}</span>
            </div>
            <div class="col">
              <span class="text">{{item.order_time}}</span>
            </div>
            <div class="col"
              style="flex:1.2">
              <span class="opr"
                @click="$router.push('/yarnOrderDetail/' + item.id + '/' + type)">详情</span>
              <span class="opr orange"
                @click="openWin('/print/orderYarnTable/'+ item.id)">打印</span>
              <span class="opr red"
                @click="deleteOrder(item.id)">删除</span>
            </div>
          </div>
        </div>
        <div class="tableMode"
          v-if="!mode">
          <div class="flexTb">
            <div class="thead gray">
              <div class="trow">
                <div class="tcolumn"
                  style="min-width:926px;">采购信息</div>
                <div class="tcolumn"
                  style="min-width:1377px;">入库信息</div>
                <div class="tcolumn"
                  style="min-width:935px;">出库信息</div>
                <div class="tcolumn"
                  style="flex:1;">回库信息</div>
              </div>
            </div>
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">采购单号</div>
                <div class="tcolumn">公司名称</div>
                <div class="tcolumn">订购时间</div>
                <div class="tcolumn noPad"
                  style="flex:25">
                  <div class="trow">
                    <div class="tcolumn">物料名称</div>
                    <div class="tcolumn">本公司颜色</div>
                    <div class="tcolumn">采购数量</div>
                    <div class="tcolumn noPad"
                      style="flex:23">
                      <div class="trow">
                        <div class="tcolumn">缸号/批号</div>
                        <div class="tcolumn">色号</div>
                        <div class="tcolumn noPad"
                          style="flex:8">
                          <div class="trow">
                            <div class="tcolumn">入库数量</div>
                            <div class="tcolumn">入库件数</div>
                            <div class="tcolumn">单价</div>
                            <div class="tcolumn">总金额</div>
                            <div class="tcolumn">仓库</div>
                            <div class="tcolumn">备注</div>
                            <div class="tcolumn">经办人</div>
                            <div class="tcolumn">入库日期</div>
                          </div>
                        </div>
                        <div class="tcolumn noPad"
                          style="flex:7">
                          <div class="trow">
                            <div class="tcolumn">出库单位</div>
                            <div class="tcolumn">出库数量</div>
                            <div class="tcolumn">出库件数</div>
                            <div class="tcolumn">仓库</div>
                            <div class="tcolumn">备注</div>
                            <div class="tcolumn">经办人</div>
                            <div class="tcolumn">出库日期</div>
                          </div>
                        </div>
                        <div class="tcolumn noPad"
                          style="flex:5">
                          <div class="trow">
                            <div class="tcolumn">回库数量</div>
                            <div class="tcolumn">回库仓库</div>
                            <div class="tcolumn">备注</div>
                            <div class="tcolumn">经办人</div>
                            <div class="tcolumn">回库日期</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in list"
                :key="item.id">
                <div class="tcolumn"
                  style="background:#D8F0E8">{{item.order_code}}</div>
                <div class="tcolumn"
                  style="background:#D8F0E8">{{item.client_name}}</div>
                <div class="tcolumn"
                  style="background:#D8F0E8">{{item.order_time}}</div>
                <div class="tcolumn noPad"
                  style="flex:25">
                  <div class="trow"
                    v-for="itemChild in item.material_info"
                    :key="itemChild.id">
                    <div class="tcolumn"
                      style="background:#D8F0E8">{{itemChild.material_name}}</div>
                    <div class="tcolumn"
                      style="background:#D8F0E8">{{itemChild.material_attribute}}</div>
                    <div class="tcolumn"
                      style="background:#D8F0E8">{{itemChild.weight}}{{itemChild.unit}}</div>
                    <div class="tcolumn noPad"
                      style="flex:23">
                      <div class="trow"
                        v-if="itemChild.logMerge.length===0"
                        style="line-height:54px;background:#e0e0e0">没有出入库信息</div>
                      <div class="trow"
                        v-for="(itemGrandson,indexGrandson) in itemChild.logMerge"
                        :key="indexGrandson">
                        <div class="tcolumn"
                          style="background:#D6E5F0">{{itemGrandson.vat_code}}</div>
                        <div class="tcolumn"
                          style="background:#D6E5F0">{{itemGrandson.color_code}}</div>
                        <div class="tcolumn noPad"
                          style="flex:8;background:#D6E5F0"
                          v-if="itemGrandson.in_log.length>0">
                          <div class="trow"
                            v-for="(itemIn,indexIn) in itemGrandson.in_log"
                            :key="indexIn">
                            <div class="tcolumn">{{itemIn.weight}}{{itemIn.unit}}</div>
                            <div class="tcolumn">{{itemIn.number||'0'}}件</div>
                            <div class="tcolumn">{{itemIn.price}}元</div>
                            <div class="tcolumn">{{Number(itemIn.number*itemIn.price)}}元</div>
                            <div class="tcolumn">{{itemIn.store_name}}</div>
                            <div class="tcolumn">{{itemIn.desc}}</div>
                            <div class="tcolumn">{{itemIn.user_name}}</div>
                            <div class="tcolumn">{{itemIn.complete_time}}</div>
                          </div>
                        </div>
                        <div class="tcolumn noPad"
                          v-if="itemGrandson.in_log.length===0"
                          style="flex:8;background:#e0e0e0;text-align:center">
                          没有入库信息
                        </div>
                        <div class="tcolumn noPad"
                          style="flex:7;background:#D6DFE0"
                          v-if="itemGrandson.out_log.length>0">
                          <div class="trow"
                            v-for="(itemOut,indexOut) in itemGrandson.out_log"
                            :key="indexOut">
                            <div class="tcolumn">{{itemOut.client_name}}</div>
                            <div class="tcolumn">{{itemOut.weight}}{{itemOut.unit}}</div>
                            <div class="tcolumn">{{itemOut.number}}件</div>
                            <div class="tcolumn">{{itemOut.store_name}}</div>
                            <div class="tcolumn">{{itemOut.desc}}</div>
                            <div class="tcolumn">{{itemOut.user_name}}</div>
                            <div class="tcolumn">{{itemOut.complete_time}}</div>
                          </div>
                        </div>
                        <div class="tcolumn noPad"
                          v-if="itemGrandson.out_log.length===0"
                          style="flex:7;background:#e0e0e0;text-align:center">
                          没有出库信息
                        </div>
                        <div class="tcolumn noPad"
                          v-if="itemGrandson.back_log.length>0"
                          style="flex:5;background:#D6C7C7">
                          <div class="trow"
                            v-for="(itemBack,indexBack) in itemGrandson.back_log"
                            :key="indexBack">
                            <div class="tcolumn">{{itemBack.weight}}{{itemBack.unit}}</div>
                            <div class="tcolumn">{{itemBack.store_name}}</div>
                            <div class="tcolumn">{{itemBack.desc}}</div>
                            <div class="tcolumn">{{itemBack.user_name}}</div>
                            <div class="tcolumn">{{itemBack.complete_time}}</div>
                          </div>
                        </div>
                        <div class="tcolumn noPad"
                          v-if="itemGrandson.back_log.length===0"
                          style="flex:5;background:#e0e0e0;text-align:center">
                          没有回库信息
                        </div>
                      </div>
                    </div>
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
            :total="total"
            :current-page.sync="page">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHash } from '@/assets/js/common.js'
import { yarnOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      loading: true,
      mode: true,
      total: 0,
      page: 1,
      orderCode: '',
      clientName: '',
      yarnName: '',
      type: '1',
      list: []
    }
  },
  filters: {
    getAllMat (matArr) {
      const str = Array.from(new Set(matArr.map((item) => item.material_name))).join(';')
      if (str.length > 34) {
        return str.slice(0, 32) + '...'
      }
      return str
    },
    totalWeight (matArr) {
      return matArr.reduce((total, current) => {
        return total + Number(current.weight)
      }, 0).toFixed(2)
    },
    totalInWeight (logArr) {
      return logArr.reduce((total, current) => {
        if (current.action_type === 1) {
          return total + Number(current.weight)
        }
        return total
      }, 0).toFixed(2)
    },
    totalOutWeight (logArr) {
      return logArr.reduce((total, current) => {
        if (current.action_type === 2) {
          return total + Number(current.weight)
        }
        return total
      }, 0).toFixed(2)
    }
  },
  watch: {
    page (newVal) {
      this.changeRouter(newVal)
    },
    $route (newVal) {
      // 点击返回的时候更新下筛选条件
      this.getFilters()
      this.getList()
    }
  },
  methods: {
    openWin (url) {
      window.open(url)
    },
    changeRouter (page) {
      const pages = page || 1
      this.$router.push('/yarnOrderList/page=' + pages + '&&order_code=' + this.orderCode + '&&material_name=' + this.yarnName + '&&client_name=' + this.clientName + '&&type=' + this.type)
    },
    reset () {
      this.page = 1
      this.orderCode = ''
      this.yarnName = ''
      this.clientName = ''
      this.changeRouter()
    },
    getList () {
      this.loading = true
      yarnOrder.list({
        order_code: this.orderCode,
        material_name: this.yarnName,
        client_name: this.clientName,
        page: this.page,
        order_type: Number(this.type),
        limit: 10
      }).then((res) => {
        this.list = res.data.data
        this.list.forEach((item) => {
          item.material_info.forEach((itemMat) => {
            itemMat.logArr = []
            item.stock_log.forEach((itemLog) => {
              if (itemLog.order_id === itemMat.id) {
                itemMat.logArr.push(itemLog)
              }
            })
          })
        })
        this.list.forEach((item) => {
          item.material_info.forEach((itemMat) => {
            itemMat.logMerge = []
            itemMat.logArr.forEach((itemLog) => {
              const finded = itemMat.logMerge.find((itemFind) => { return itemFind.vat_code === itemLog.vat_code && itemFind.color_code === itemLog.color_code })
              if (finded) {
                if (itemLog.action_type === 1) {
                  finded.in_log.push(itemLog)
                } else if (itemLog.action_type === 2) {
                  finded.out_log.push(itemLog)
                } else if (itemLog.action_type === 3) {
                  finded.back_log.push(itemLog)
                }
              } else {
                if (itemLog.action_type === 1) {
                  itemLog.in_log = [itemLog]
                  itemLog.out_log = []
                  itemLog.back_log = []
                } else if (itemLog.action_type === 2) {
                  itemLog.in_log = []
                  itemLog.out_log = [itemLog]
                  itemLog.back_log = []
                } else if (itemLog.action_type === 3) {
                  itemLog.in_log = []
                  itemLog.out_log = []
                  itemLog.back_log = [itemLog]
                }
                itemMat.logMerge.push(itemLog)
              }
            })
          })
        })
        this.total = res.data.meta.total
        this.loading = false
      })
    },
    // 更新筛选条件
    getFilters () {
      const params = getHash(this.$route.params.params)
      this.page = Number(params.page)
      this.orderCode = params.order_code || ''
      this.yarnName = params.material_name || ''
      this.clientName = params.client_name || ''
      this.type = params.type || '0'
    },
    deleteOrder (id) {
      this.$confirm('请确保该采购单没有任何出入库记录才能删除，是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        yarnOrder.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  created () {
    this.getFilters()
    this.getList()
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/yarnOrderList.less";
</style>

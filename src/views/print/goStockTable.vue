<template>
  <div id='goStockTable'
    class='printHtml'>
    <div class="printTable crosswise">
      <div class="print_head leftRight">
        <div class="left">
          <span class="title">{{title}}</span>
          <span class="item">
            <span class="label">订单信息：</span>
            {{order_code}}
          </span>
          <span class="item">
            <div class="item_row">
              <span class="label">订购公司：</span>
              {{client_name}}
            </div>
            <div class="item_row">
              <span class="label">采购单号：</span>
              {{order_yarn_code}}
            </div>
          </span>
          <span class="item">
            <div class="item_row">
              <span class="label">创建时间：</span>
              {{$getTime()}}
            </div>
            <div class="item_row">
              <span class="label">操作人：</span>
              {{user_name}}
            </div>
          </span>
        </div>
        <div class="right">
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="二维码">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <div class="row_item center">入库时间</div>
          <div class="row_item left w180">物料名称</div>
          <!-- <div class="row_item right">物料单价</div> -->
          <div class="row_item left">颜色属性</div>
          <div class="row_item left">批号/缸号</div>
          <div class="row_item left">色号</div>
          <div class="row_item right">入库数量</div>
          <div class="row_item right">入库件数</div>
          <!-- <div class="row_item right">入库总价</div> -->
          <div class="row_item left">入库仓库</div>
        </div>
        <div class="print_row"
          v-for="(item,index) in logInfo"
          :key="index">
          <div class="row_item center">{{$getTime(item.created_at)}}</div>
          <div class="row_item left w180">{{item.material_name}}</div>
          <!-- <div class="row_item right">{{item.price || 0}}元/kg</div> -->
          <div class="row_item left">{{item.material_attribute}}</div>
          <div class="row_item left">{{item.vat_code}}</div>
          <div class="row_item left">{{item.color_code}}</div>
          <div class="row_item right">{{item.weight}}kg</div>
          <div class="row_item right">{{item.number}}</div>
          <!-- <div class="row_item right">{{item.total_price}}元</div> -->
          <div class="row_item left">{{item.store_name}}</div>
        </div>
        <div class="print_row"
          v-if="logInfo.length === 0">
          <div class="row_item center">暂无数据</div>
        </div>
        <div class="print_row bgGray">
          <div class="row_item center noBorder">合计</div>
          <div class="row_item left w180 noBorder"></div>
          <!-- <div class="row_item right noBorder"></div> -->
          <div class="row_item left noBorder"></div>
          <div class="row_item left noBorder"></div>
          <div class="row_item left noBorder"></div>
          <div class="row_item right noBorder">{{compTotalWeight}}kg</div>
          <div class="row_item right noBorder"></div>
          <!-- <div class="row_item right noBorder">{{compTotalPrice}}元</div> -->
          <div class="row_item left noBorder"></div>
        </div>
      </div>
      <div class="print_remark">
        <div class="print_row noBorder">
          <div class="row_item center w180">备注</div>
          <div class="row_item left remark_span">{{remark}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { yarnOrder } from '@/assets/js/api.js'
export default {
  data () {
    return {
      title: window.sessionStorage.getItem('company_name') + '物料入库单',
      user_name: window.sessionStorage.getItem('user_name'),
      order_code: '',
      order_yarn_code: '',
      client_name: '',
      logInfo: [],
      remark: '',
      qrCodeUrl: ''
    }
  },
  methods: {
    init (id, logIdArr) {
      yarnOrder.detail({
        id: id
      }).then(res => {
        if (res.data.status !== false) {
          const data = res.data.data
          this.order_code = data.order_code
          this.order_yarn_code = data.inside_code
          this.client_name = data.client_name
          this.remark = data.desc
          if (logIdArr) {
            this.logInfo = data.stock_log.filter(itemF => logIdArr.indexOf(itemF.id) !== -1)
          } else {
            this.logInfo = data.stock_log.filter(itemF => itemF.action_type === 1)
          }
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      })
    }
  },
  created () {
    this.init(this.$route.params.id, this.$route.query.logId ? this.$route.query.logId.split('-').map(itemM => +itemM) : null)
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/yarnOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  },
  computed: {
    compTotalWeight () {
      return this.logInfo.map(itemM => (+itemM.weight || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    },
    compTotalPrice () {
      return this.logInfo.map(itemM => (+itemM.total_price || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/print/goStockTable.less";
</style>

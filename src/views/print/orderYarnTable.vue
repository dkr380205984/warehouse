<template>
  <div id='orderYarnTable'
    class='printHtml'>
    <div class="printTable">
      <div class="print_head">
        <div class="left">
          <span class="title">{{title}}</span>
          <span class="item"><span class="label">操作人：</span>{{user_name}}</span>
          <span class="item"><span class="label">联系电话：</span>{{user_tel}}</span>
          <span class="item"><span class="label">创建日期：</span>{{$getTime()}}</span>
        </div>
        <div class="right">
          <!-- <span class="text"></span> -->
          <span class="qrCode_box">
            <img :src="qrCodeUrl"
              alt="qrcode">
          </span>
        </div>
      </div>
      <div class="print_body">
        <div class="print_row">
          <span class="row_item w180 center">采购单号</span>
          <span class="row_item left">{{info.order_yarn_code}}</span>
          <span class="row_item w180 center">订单信息</span>
          <span class="row_item left">{{info.order_code}}</span>
        </div>
        <div class="print_row has_marginBottom">
          <span class="row_item w180 center">物料订购公司</span>
          <span class="row_item left">{{info.client_name}}</span>
          <span class="row_item w180 center">订购日期</span>
          <span class="row_item left">{{info.order_time}}</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item w80 center">序号</span>
          <span class="row_item left">原料名称</span>
          <span class="row_item w180 right">单价</span>
          <span class="row_item w180 left">颜色属性</span>
          <span class="row_item w180 right">原料数量</span>
        </div>
        <div class="print_row"
          v-for="(item,index) in info.material_info"
          :key="index">
          <span class="row_item w80 center">{{index+1}}</span>
          <span class="row_item left">{{item.material_name}}</span>
          <span class="row_item w180 right">{{item.price || 0}}元/kg</span>
          <span class="row_item w180 left">{{item.material_attribute}}</span>
          <span class="row_item w180 right">{{item.weight}}kg</span>
        </div>
        <div class="print_row bgGray">
          <span class="row_item left noBorder">合计</span>
          <span class="row_item w180 right noBorder"></span>
          <span class="row_item w180 left noBorder"></span>
          <span class="row_item w180 right noBorder">{{compTotalPrice}}元</span>
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
      user_name: window.sessionStorage.getItem('user_name'),
      title: window.sessionStorage.getItem('company_name') + '采购单',
      user_tel: window.sessionStorage.getItem('telephone'),
      qrCodeUrl: '',
      info: {
        material_info: []
      }
    }
  },
  methods: {
    init (id, logIdArr) {
      this.loading = true
      yarnOrder.detail({
        id: id
      }).then(res => {
        if (res.data.status !== false) {
          this.info = res.data.data
          this.info.material_info = this.info.material_info.filter(itemF => logIdArr.indexOf(itemF.id) !== -1)
        }
        this.loading = false
        setTimeout(() => {
          window.print()
        }, 1000)
      })
    }
  },
  created () {
    this.init(this.$route.params.id, this.$route.query.logId ? this.$route.query.logId.split('-').map(itemM => +itemM) : null)
  },
  computed: {
    compTotalPrice () {
      return this.info.material_info.map(itemM => ((itemM.price * itemM.weight) || 0)).reduce((a, b) => {
        return a + b
      }, 0)
    }
  },
  mounted () {
    const QRCode = require('qrcode')
    QRCode.toDataURL(window.location.origin + '/yarnOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (!err) {
        this.qrCodeUrl = url
      }
    })
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/print/orderYarnTable.less";
</style>

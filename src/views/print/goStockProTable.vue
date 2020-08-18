<template>
  <div id='goStockTable'
    class='printHtml'>
    <template v-for="(itemT,indexT) in allData">
      <div class="printTable crosswise"
        :key="indexT">
        <div class="print_head leftRight">
          <div class="left">
            <span class="title">{{`${title}${itemT.action_type}单`}}</span>
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
            <span class="item">
              <div class="item_row">
                <span class="label">{{itemT.action_type === '出库' ? '出库单位' : '供应商'}}：</span>
                {{itemT.client_name}}
              </div>
              <div class="item_row">
                <span class="label">{{`${itemT.action_type}时间：`}}</span>
                {{itemT.created_time}}
              </div>
            </span>
          </div>
          <div class="right">
            <span class="qrCode_box">
              <img :src="(itemT.image && itemT.image[0] && itemT.image[0].image_url) || defaultImg"
                alt="图片" />
            </span>
          </div>
        </div>
        <div class="print_body">
          <div class="print_row"
            style="min-height:60px">
            <div class="row_item center w180">
              <span class="style_code">款号</span>
              <span class="first_line"></span>
              <span class="color">颜色</span>
              <span class="second_line"></span>
              <span class="size">号型</span>
            </div>
            <div class="row_item center w180">品名</div>
            <div class="row_item"
              style="flex:5">
              <div class="print_row noBorder"
                style="min-height:60px">
                <div class="row_item center w140">颜色属性</div>
                <div class="row_item center"
                  v-for="(itemS,indexS) in itemT.sizeArr"
                  :key="indexS">{{itemS.size_name}}</div>
                <div class="row_item center">小计</div>
              </div>
            </div>
          </div>
          <div class="print_row">
            <div class="row_item center w180">{{itemT.style_code}} </div>
            <div class="row_item center w180">{{itemT.product_name}}</div>
            <div class="row_item col"
              style="flex:5">
              <div class="print_row"
                :class="indexC === 0 ? 'noBorder' : ''"
                v-for="(itemC,indexC) in itemT.colorArr"
                :key="indexC">
                <div class="row_item center w140">{{itemC.color_name}}</div>
                <div class="row_item center"
                  v-for="(itemS,indexS) in itemT.sizeArr"
                  :key="indexS">{{itemC.sizeInfo[itemS.size_name] || 0}}</div>
                <div class="row_item center">{{itemC.sizeInfo|filterRowTotal}}</div>
              </div>
            </div>
          </div>
          <div class="print_row bgGray">
            <div class="row_item center noBorder w180"></div>
            <div class="row_item center noBorder w180"></div>
            <div class="row_item"
              style="flex:5">
              <div class="print_row noBorder">
                <div class="row_item noBorder center w140"></div>
                <div class="row_item noBorder center"
                  v-for="(itemS,indexS) in itemT.sizeArr"
                  :key="indexS"></div>
                <div class="row_item noBorder center">合计：{{itemT.colorArr|filterTotal}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="print_remark">
          <div class="print_row noBorder">
            <div class="row_item center w180">备注</div>
            <div class="row_item left remark_span"></div>
          </div>
        </div>
        <div class="footCtn">
          <span class="item">制单人：{{user_name}}</span>
          <span class="item">产品交接人：</span>
          <span class="item">{{itemT.action_type}}人：</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { outAndIn } from '@/assets/js/api.js'
export default {
  data () {
    return {
      title: window.sessionStorage.getItem('company_name') + '成衣',
      user_name: window.sessionStorage.getItem('user_name'),
      defaultImg: require('@/assets/image/index/noPic.jpg'),
      client_name: '',
      allData: []
    }
  },
  methods: {
    init (id) {
      outAndIn.detail({
        id: id
      }).then(res => {
        if (res.data.status !== false) {
          this.allData = this.$mergeData(res.data.data.map(item => {
            return {
              action_type: item.action_type === 1 ? '入库' : '出库',
              client_name: item.client_name,
              created_time: this.$getTime(item.created_at),
              number: item.number,
              // price: item.price,
              product_id: item.product_info.id,
              image: item.product_info.images,
              product_name: item.product_info.name,
              product_code: item.product_info.product_code,
              style_code: item.product_info.style_code,
              size_name: item.size_info.size_name,
              color_name: item.size_info.color_name
              // store_name: item.store_name,
              // user_name: item.user_name
            }
          }), {
            mainRule: ['action_type', 'client_name', 'created_time', 'product_id'],
            otherRule: [
              { name: 'product_code' },
              { name: 'image' },
              { name: 'product_name' },
              { name: 'style_code' }
            ],
            childrenName: 'size_info',
            childrenRule: {
              mainRule: ['size_name', 'color_name'],
              otherRule: [
                { name: 'number', type: 'add' }
                // { name: 'price' },
                // { name: 'store_name' },
                // { name: 'user_name' }
              ]
            }
          }).map(itemPro => {
            let colorInfo = []
            itemPro.size_info.forEach(itemS => {
              let flag = colorInfo.find(itemF => itemF.color_name === itemS.color_name)
              if (flag) {
                flag.sizeInfo[itemS.size_name] = (+flag.sizeInfo[itemS.size_name] || 0) + (+itemS.number || 0)
              } else {
                colorInfo.push({
                  color_name: itemS.color_name,
                  sizeInfo: {
                    [itemS.size_name]: +itemS.number || 0
                  }
                })
              }
            })
            return {
              action_type: itemPro.action_type,
              client_name: itemPro.client_name,
              created_time: itemPro.created_time,
              product_id: itemPro.product_id,
              image: itemPro.image,
              product_code: itemPro.product_code,
              product_name: itemPro.product_name,
              style_code: itemPro.style_code,
              sizeArr: this.$mergeData(itemPro.size_info, { mainRule: 'size_name' }),
              colorArr: colorInfo
            }
          })
          setTimeout(() => {
            window.print()
          }, 1000)
        }
      })
    }
  },
  created () {
    this.init(this.$route.params.id.split('-'))
  },
  mounted () {
    // const QRCode = require('qrcode')
    // QRCode.toDataURL(window.location.origin + '/yarnOrderDetail/' + this.$route.params.id, { errorCorrectionLevel: 'H' }, (err, url) => {
    //   if (!err) {
    //     this.qrCodeUrl = url
    //   }
    // })
  },
  filters: {
    filterRowTotal (item) {
      let total = 0
      for (let prop in item) {
        total += (+item[prop] || 0)
      }
      return total
    },
    filterTotal (item) {
      let total = 0
      for (let prop in item) {
        for (let index in item[prop].sizeInfo) {
          total += (+item[prop].sizeInfo[index] || 0)
        }
      }
      return total
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/assets/less/print/goStockProTable.less";
</style>

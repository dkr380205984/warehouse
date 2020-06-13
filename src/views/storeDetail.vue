<template>
  <div id="storeDetail"
    class="contentMain">
    <div class="module">
      <div class="titleCtn">
        <span class="title">产品列表</span>
        <div class="btn btnBlue"
          @click="createProFlag=true">添加新产品</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="storeName"
              @change="getProList"
              placeholder="请输入编号/名称查询"></el-input>
            <el-date-picker class="inputs"
              v-model="storeDate"
              type="date"
              @change="getProList"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset('pro')">重置</div>
          </div>
        </div>
        <div class="list">
          <div class="flexTb"
            style="border-bottom:0">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">产品编号</div>
                <div class="tcolumn">产品名称/款号</div>
                <div class="tcolumn">产品图片</div>
                <div class="tcolumn noPad"
                  style="flex:7">
                  <div class="trow">
                    <div class="tcolumn">尺码配色</div>
                    <div class="tcolumn">库存数量</div>
                    <div class="tcolumn">销售数量</div>
                    <div class="tcolumn">入库均价/总价</div>
                    <div class="tcolumn">销售均价/总价</div>
                    <div class="tcolumn">更新日期</div>
                    <div class="tcolumn">操作</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in productList"
                :key="item.id">
                <div class="tcolumn">ABC123456
                  <span style="cursor:pointer;color:#1a95ff"
                    @click="goUpdatePro(item)">(修改产品)</span>
                </div>
                <div class="tcolumn">产品名称/款号</div>
                <div class="tcolumn">产品图片</div>
                <div class="tcolumn noPad"
                  style="flex:7">
                  <div class="trow"
                    v-for="itemChild in item.arr"
                    :key="itemChild.size_id">
                    <div class="tcolumn">尺码配色</div>
                    <div class="tcolumn">库存数量</div>
                    <div class="tcolumn">销售数量</div>
                    <div class="tcolumn">销售总价</div>
                    <div class="tcolumn">均价</div>
                    <div class="tcolumn">更新日期</div>
                    <div class="tcolumn fuck">
                      <span class="btn noBorder self"
                        @click="addPro(item.id,itemChild.size_id,1)">入库</span>
                      <span class="btn noBorder self"
                        @click="addPro(item.id,itemChild.size_id,2)">出库</span>
                      <span class="btn noBorder self"
                        style="color:rgb(245, 34, 45)"
                        @click="deleteSizeColor(item.id,itemChild.size_id)">删除</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="createModule"
              v-for="(item,index) in productData"
              :key="index">
              <div class="deleteIconBtn"
                @click="deletePro(index)">
                <i class="el-icon-close"></i>
              </div>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">选择产品</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择产品编号"
                      v-model="item.id"></el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">操作类型</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择操作类型"
                      v-model="item.type"></el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">供货单位</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="请输入供货单位名称"
                      v-model="item.client"></el-input>
                  </div>
                </div>
              </div>
              <div class="rowCtn"
                v-for="(itemChild,indexChild) in item.childrenArr"
                :key="indexChild">
                <div class="colCtn">
                  <div class="label"
                    v-if="indexChild===0">
                    <span class="text">尺码颜色</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择尺码颜色"
                      v-model="itemChild.colorSize"></el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label"
                    v-if="indexChild===0">
                    <span class="text">出/入库数量</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="请输入数字"
                      v-model="itemChild.number"></el-input>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label"
                    v-if="indexChild===0">
                    <span class="text">产品价格</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="请输入价格"
                      v-model="itemChild.price"></el-input>
                  </div>
                  <div class="editBtn addBtn"
                    v-if="indexChild===0"
                    @click="addChild(item.childrenArr)">添加</div>
                  <div class="editBtn deleteBtn"
                    v-if="indexChild>0"
                    @click="deleteChild(item.childrenArr,indexChild)">删除</div>
                </div>
              </div>
              <div class="rowCtn">
                <div class="colCtn">
                  <div class="label">
                    <span class="text">请选择仓库/货架</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择尺码颜色"
                      v-model="item.store_id">
                      <el-option v-for="item in stockArr"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">产品总价</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <span class="spanInput"> {{totalPrice(item.childrenArr)}}</span>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">备注信息</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="备注信息"
                      v-model="value"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="addRows">
              <span v-if="!addProFlag"
                class="once gray"
                @click="addPro">添加产品</span>
              <span v-if="addProFlag"
                class="once cancle"
                @click="cancle">取消</span>
              <span v-if="addProFlag"
                class="once normal"
                @click="addPro">添加产品</span>
              <span v-if="addProFlag"
                class="once ok"
                @click="saveLog">保存</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="10"
            layout="prev, pager, next"
            :total="totalPro"
            :current-page.sync="pagePro"
            @current-change="getProList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module">
      <div class="titleCtn">
        <span class="title">仓库日志</span>
        <div class="btn btnBlue"
          @click="createStoreFlag=true">添加新仓库/货架</div>
      </div>
      <div class="listCtn">
        <div class="filterCtn">
          <div class="leftCtn">
            <span class="label">筛选条件：</span>
            <el-input class="inputs"
              v-model="proName"
              @change="getStoreLogList"
              placeholder="请输入编号查询"></el-input>
            <el-date-picker class="inputs"
              v-model="proDate"
              type="date"
              @change="getStoreLogList"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnGray"
              style="margin-left:0"
              @click="reset('store')">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn noBorder"
              @click="deleteLog(null,true)">批量删除</div>
            <div class="btn noBorder">批量打印</div>
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
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn">产品名称</div>
                  <div class="tcolumn">款号</div>
                  <div class="tcolumn">尺码颜色</div>
                  <div class="tcolumn">单价</div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作类型</div>
                  <div class="tcolumn">供货单位</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作时间</div>
                  <div class="tcolumn">操作</div>
                </div>
              </div>
              <div class="tbody">
                <div class="trow"
                  v-for="item in storeLogList"
                  :key="item.id">
                  <span class="tcolumn"
                    style="flex:0.2">
                    <el-checkbox v-model="item.check"></el-checkbox>
                  </span>
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn">产品名称</div>
                  <div class="tcolumn">款号</div>
                  <div class="tcolumn">尺码颜色</div>
                  <div class="tcolumn">单价</div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作类型</div>
                  <div class="tcolumn">供货单位</div>
                  <div class="tcolumn">备注</div>
                  <div class="tcolumn">操作人</div>
                  <div class="tcolumn">操作时间</div>
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
    <!-- 新增产品 -->
    <div class="popup"
      v-show="createProFlag">
      <div class="main">
        <div class="title">
          <div class="text">添加产品</div>
          <i class="el-icon-close"
            @click="createProFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">产品名称：</div>
            <div class="info">
              <el-input placeholder="请输入产品名称(不超过10个中文字)"
                v-model="productInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">产品款号：</div>
            <div class="info">
              <el-input placeholder="请输入产品款号(不超过10个中文字)"
                v-model="productInfo.type"></el-input>
            </div>
          </div>
          <div class="row"
            v-for="(itemChild,indexChild) in productInfo.childrenArr"
            :key="indexChild">
            <div class="label">{{indexChild===0?'产品信息：':''}}</div>
            <div class="info flex">
              <el-input v-model="itemChild.size"
                placeholder="尺码"></el-input>
              <el-input v-model="itemChild.color"
                placeholder="颜色"></el-input>
              <el-input v-model="itemChild.price"
                placeholder="单价"></el-input>
              <el-input v-model="itemChild.number"
                placeholder="数量"></el-input>
            </div>
            <div v-if="indexChild===0"
              class="editBtn blue"
              @click="createChild(productInfo.childrenArr)">添加</div>
            <div v-if="indexChild>0"
              class="editBtn red"
              @click="deleteChild(productInfo.childrenArr,indexChild)">删除</div>
          </div>
          <div class="row">
            <div class="label">选择仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="productInfo.store_id"></el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">上传图片：</div>
            <div class="info"
              style="padding-top:5px">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :file-list="fileArr"
                :on-success="successFile"
                :data="postData"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"
                    style="color:#1a95ff"></i>
                  <span style="color:#1a95ff">点击上传产品图片</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="createProFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="savePro">确定</div>
        </div>
      </div>
    </div>
    <!-- 修改产品 -->
    <div class="popup"
      v-show="updateProFlag">
      <div class="main">
        <div class="title">
          <div class="text">修改产品</div>
          <i class="el-icon-close"
            @click="updateProFlag=false"></i>
        </div>
        <div class="content">
          <div class="row">
            <div class="label">产品名称：</div>
            <div class="info">
              <el-input placeholder="请输入产品名称(不超过10个中文字)"
                v-model="updateInfo.name"></el-input>
            </div>
          </div>
          <div class="row">
            <div class="label">产品款号：</div>
            <div class="info">
              <el-input placeholder="请输入产品款号(不超过10个中文字)"
                v-model="updateInfo.type"></el-input>
            </div>
          </div>
          <div class="row"
            v-for="(itemChild,indexChild) in updateInfo.childrenArr"
            :key="indexChild">
            <div class="label">{{indexChild===0?'产品信息：':''}}</div>
            <div class="info flex">
              <el-input v-model="itemChild.size"
                placeholder="尺码"></el-input>
              <el-input v-model="itemChild.color"
                placeholder="颜色"></el-input>
              <el-input v-model="itemChild.price"
                placeholder="单价"></el-input>
              <el-input v-model="itemChild.number"
                placeholder="数量"></el-input>
            </div>
            <div v-if="indexChild===0"
              class="editBtn blue"
              @click="createChild(updateInfo.childrenArr)">添加</div>
            <div v-if="indexChild>0"
              class="editBtn red"
              @click="deleteChild(updateInfo.childrenArr,indexChild)">删除</div>
          </div>
          <div class="row">
            <div class="label">选择仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="updateInfo.store_id"></el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">上传图片：</div>
            <div class="info"
              style="padding-top:5px">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :file-list="fileArr"
                :on-success="successFile"
                :data="postData"
                ref="uploada"
                list-type="picture">
                <div class="uploadBtn">
                  <i class="el-icon-upload"
                    style="color:#1a95ff"></i>
                  <span style="color:#1a95ff">点击上传产品图片</span>
                </div>
                <div slot="tip"
                  class="el-upload__tip">只能上传jpg/png图片文件，且不超过10M</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="opr">
          <div class="btn btnGray"
            @click="updateProFlag = false">取消</div>
          <div class="btn btnBlue"
            @click="updatePro">确定</div>
        </div>
      </div>
    </div>
    <!-- 新增仓库 -->
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
  </div>
</template>

<script>
import { getToken, store, product, outAndIn } from '@/assets/js/api.js'
export default {
  data () {
    return {
      createProFlag: false,
      updateProFlag: false,
      createStoreFlag: false,
      addProFlag: false,
      proName: '',
      proDate: '',
      storeName: '',
      storeDate: '',
      pagePro: 1,
      totalPro: 1,
      pageStoreLog: 1,
      totalStoreLog: 1,
      value: '',
      productData: [],
      productInfo: {
        name: '',
        type: '',
        childrenArr: [{
          color: '',
          size: '',
          number: '',
          price: ''
        }],
        store_id: '',
        image: []
      },
      updateInfo: {
        name: '',
        type: '',
        childrenArr: [{
          color: '',
          size: '',
          number: '',
          price: ''
        }],
        store_id: '',
        image: []
      },
      storeInfo: {
        name: ''
      },
      productList: [{
        id: 1,
        text: '假设有数据',
        arr: [{
          size_id: 1,
          text: '假设有儿子'
        }, {
          size_id: 2,
          text: '假设有儿子'
        }]
      }, {
        id: 2,
        text: '假设有数据',
        arr: [{
          size_id: 2,
          text: '假设有儿子'
        }]
      }],
      storeLogList: [{
        text: '假设有数据',
        id: 1
      }, {
        text: '假设有数据',
        id: 2
      }],
      fileArr: [],
      stockArr: [],
      postData: { token: '' },
      checkAll: false
    }
  },
  methods: {
    checkAllLog (flag) {
      this.storeLogList.forEach((item) => {
        item.check = flag
      })
    },
    getStoreLogList () {
      outAndIn.list({
        // name: this.storeName,
        // date: this.storeDate,
        page: this.pageStoreLog,
        limit: 5
      }).then((res) => {
        if (res.data.status) {
          this.storeLogList = res.data.data
        }
      })
    },
    getProList () {
      product.list({
        // name: this.proName,
        // date: this.proDate,
        page: this.pagePro,
        limit: 5
      }).then((res) => {
        if (res.data.status) {
          this.productList = res.data.data
        }
      })
    },
    getStoreList () {
      store.list().then((res) => {
        if (res.data.status) {
          this.stockArr = res.data.data
        }
      })
    },
    cancle () {
      this.productData = []
      this.addProFlag = false
    },
    totalPrice (arr) {
      console.log(arr)
      return arr.reduce((total, current) => {
        return current.number * current.price + total
      }, 0)
    },
    deletePro (index) {
      if (this.productData.length === 1) {
        this.addProFlag = false
      }
      this.productData.splice(index, 1)
    },
    addPro (id, colorSize, type) {
      if (!this.addProFlag) {
        this.addProFlag = true
      }
      this.productData.push({
        id: id || '',
        type: type || '',
        client: '',
        store_id: '',
        desc: '',
        childrenArr: [{
          colorSize: colorSize || '',
          number: '',
          price: ''
        }]
      })
    },
    addChild (item) {
      item.push({
        colorSize: '',
        number: '',
        price: ''
      })
    },
    createChild (item) {
      item.push({
        size: '',
        color: '',
        number: '',
        price: ''
      })
    },
    deleteChild (item, index) {
      if (item.length === 1) {
        this.$message.error('至少有一种尺码配色')
        return
      }
      item.splice(index, 1)
    },
    deleteSizeColor () {
      // 删除尺码配色需要判断库存数量为0
    },
    beforeAvatarUpload (file) {
      const fileName = file.name.lastIndexOf('.')// 取到文件名开始到最后一个点的长度
      const fileNameLength = file.name.length// 取到文件名长度
      const fileFormat = file.name.substring(fileName + 1, fileNameLength)// 截
      this.postData.key = Date.parse(new Date()) + '.' + fileFormat
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPNG) {
        this.$message.error('图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
        return false
      }
    },
    successFile (response, file, fileList) {
      this.productInfo.image.push('https://zhihui.tlkrzf.com/' + response.key)
    },
    savePro () {
      let errorMsg = ''
      if (!this.productInfo.name) {
        errorMsg = '请填写产品名称'
      }
      if (!this.productInfo.store_id) {
        errorMsg = '请选择仓库'
      }
      this.productInfo.childrenArr.forEach((item) => {
        if (!item.size) {
          errorMsg = '尺码未填写'
        }
        if (!item.color) {
          errorMsg = '颜色未填写'
        }
        if (!item.number) {
          errorMsg = '数量未填写'
        }
        if (!item.price) {
          errorMsg = '单价未填写'
        }
      })
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      const data = this.productInfo
      const formData = {
        name: data.name,
        image: data.image,
        style_code: data.type,
        store_id: data.store_id,
        size_info: data.childrenArr.map((item) => {
          return {
            size_name: item.size,
            color_name: item.color,
            number: item.number,
            price: item.price
          }
        })
      }
      product.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
        this.createProFlag = false
        this.getProList()
      })
    },
    goUpdatePro (item) {
      this.updateProFlag = true
    },
    updatePro () {

    },
    saveStore () {
      if (!this.storeInfo.name) {
        this.$message.error('请填写仓库名称')
      }
      store.create({
        name: this.storeInfo.name
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
        this.createProFlag = false
        this.getStoreList()
      })
    },
    saveLog () {
      let errorMsg = ''
      this.productData.forEach((item) => {
        if (!item.id) {
          errorMsg = '请选择产品'
        }
        if (!item.type) {
          errorMsg = '请选择操作类型'
        }
        if (!item.store_id) {
          errorMsg = '请选择仓库'
        }
        item.childrenArr.forEach((itemChild) => {
          if (!item.colorSize) {
            errorMsg = '请选择产品尺码颜色'
          }
          if (!item.number) {
            errorMsg = '请填写数量'
          }
          if (!item.price) {
            errorMsg = '请填写价格，如果没有价格请填0'
          }
        })
      })
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      const formData = this.productData.map((item) => {
        return {
          product_id: item.id,
          stock_id: item.store_id,
          client_name: item.client,
          desc: item.desc,
          action_type: item.type,
          size_info: item.childrenArr.map((itemChild) => {
            return {
              size_id: itemChild.colorSize,
              price: itemChild.price,
              number: itemChild.number
            }
          })
        }
      })
      outAndIn.create({
        data: formData
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.getProList()
          this.getStoreLogList()
        }
      })
    },
    deleteLog (id, ifAll) {
      if (ifAll) {
        const arr = this.storeLogList.filter((item) => item.check).map((item) => item.id)
        if (arr.length === 0) {
          this.$message.error('请至少勾选一项')
          return
        }
        outAndIn.delete({
          id: arr
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.getStoreLogList()
          }
        })
      } else {
        outAndIn.delete({
          id: [id]
        }).then((res) => {
          if (res.data.status) {
            this.$message.success('删除成功')
            this.getStoreLogList()
          }
        })
      }
    },
    reset (flag) {
      if (flag === 'pro') {
        this.proName = ''
        this.proDate = ''
        this.getProList()
      }
      if (flag === 'store') {
        this.storeName = ''
        this.storeDate = ''
        this.getStoreLogList()
      }
    }
  },
  created () {
    Promise.all([
      getToken(),
      store.list(),
      product.list()
    ]).then((res) => {
      console.log(res)
      this.postData.token = res[0].data.data
      this.stockArr = res[1].data.data
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/storeDetail.less";
</style>

<template>
  <div id="storeDetail"
    class="contentMain"
    v-loading="loading">
    <div class="listCutCtn">
      <div class="cut_item"
        :class="{'active':showProList}"
        @click="showProList = true">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaojihua"></use>
        </svg>
        <span class="name">产品列表</span>
      </div>
      <div class="cut_item"
        :class="{'active':!showProList}"
        @click="showProList = false">
        <svg class="iconFont"
          aria-hidden="true">
          <use xlink:href="#icon-wuliaochuruku"></use>
        </svg>
        <span class="name">仓库列表</span>
      </div>
    </div>
    <div class="module"
      v-if="showProList">
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
              v-model="proName"
              @change="getProList"
              placeholder="请输入产品名称查询"></el-input>
            <el-date-picker class="inputs"
              value-format="yyyy-MMM-dd"
              v-model="proDate"
              type="date"
              @change="getProList"
              placeholder="选择日期">
            </el-date-picker>
            <div class="btn btnBlue"
              style="margin-left:0px"
              @click="getProList">搜索</div>
            <div class="btn btnGray"
              style="margin-left:12px"
              @click="reset('pro')">重置</div>
          </div>
        </div>
        <div class="list">
          <!-- <div class="flexTb"
            style="border-bottom:0">
            <div class="thead">
              <div class="trow">
                <div class="tcolumn">产品编号</div>
                <div class="tcolumn">产品名称/款号</div>
                <div class="tcolumn">产品图片</div>
                <div class="tcolumn noPad"
                  style="flex:8">
                  <div class="trow">
                    <div class="tcolumn">尺码配色</div>
                    <div class="tcolumn">库存数量</div>
                    <div class="tcolumn">销售数量</div>
                    <div class="tcolumn">销售均价</div>
                    <div class="tcolumn">销售总额</div>
                    <div class="tcolumn">更新日期</div>
                    <div class="tcolumn"
                      style="flex:1.3;">操作</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tbody">
              <div class="trow"
                v-for="item in productList"
                :key="item.id">
                <div class="tcolumn">{{item.product_code}}
                  <div>
                    <span style="cursor:pointer;color:#1a95ff;margin-right:12px"
                      @click="goUpdatePro(item)">修改</span>
                    <span style="cursor:pointer;color:rgb(245, 34, 45)"
                      @click="deleteProReal(item.id)">删除产品</span>
                  </div>
                </div>
                <div class="tcolumn">
                  <span style="color:#1a95ff">{{item.name}}</span>
                  <span>{{item.style_code}}</span></div>
                <div class="tcolumn">
                  <zh-img-list :list="item.image"></zh-img-list>
                </div>
                <div class="tcolumn noPad"
                  style="flex:8">
                  <div class="trow"
                    v-for="(itemChild,indexChild) in item.size_info"
                    :key="indexChild">
                    <div class="tcolumn">{{itemChild.size_name}}/{{itemChild.color_name}}</div>
                    <div class="tcolumn">{{itemChild.total_number}}</div>
                    <div class="tcolumn">{{itemChild.sell_number}}</div>
                    <div class="tcolumn">
                      <div>
                        <span style="color:#1a95ff">{{itemChild.sell_avg_price}}</span>元
                      </div>
                    </div>
                    <div class="tcolumn">
                      <div>
                        <span style="color:#01B48C">{{itemChild.sell_total_price}}</span>元
                      </div>
                    </div>
                    <div class="tcolumn">{{$getTime(itemChild.update_time)}}</div>
                    <div class="tcolumn fuck"
                      style="flex:1.3;justify-content: space-around;">
                      <span class="btn noBorder self"
                        @click="addPro(item.id,itemChild.id,1)">入库</span>
                      <span class="btn noBorder self"
                        @click="addPro(item.id,itemChild.id,2)">出库</span>
                      <span class="btn noBorder self"
                        style="color:rgb(245, 34, 45)"
                        @click="deleteSizeColor(itemChild.id)">删除尺码</span>
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
                      filterable
                      remote
                      :remote-method="searchProList"
                      @change="getColorSize"
                      v-model="item.id">
                      <el-option v-for="item in proSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">操作类型</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择操作类型"
                      v-model="item.type">
                      <el-option :value='1'
                        label="入库"></el-option>
                      <el-option :value='2'
                        label="出库"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出入库单位</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="请输入出入库单位名称"
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
                      v-model="itemChild.colorSize">
                      <el-option v-for="(itemSize,indexSize) in getColorSize(item.id)"
                        :label="itemSize.size_name + '/' + itemSize.color_name"
                        :value="itemSize.id"
                        :key="indexSize"></el-option>
                    </el-select>
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
                    <el-select placeholder="请选择仓库/货架"
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
                @click="addPro()">添加出入库</span>
              <span v-if="addProFlag"
                class="once cancle"
                @click="cancle">取消</span>
              <span v-if="addProFlag"
                class="once normal"
                @click="addPro">添加出入库</span>
              <span v-if="addProFlag"
                class="once ok"
                @click="saveLog">保存</span>
            </div>
          </div> -->
          <div class="tableCtnLv2">
            <div class="tb_header">
              <div class="tb_row middle">产品编号</div>
              <div class="tb_row">产品名称/款号</div>
              <div class="tb_row middle">产品图片</div>
              <div class="tb_row">总库存数量(件)</div>
              <div class="tb_row">总销售数量(件)</div>
              <div class="tb_row">销售均价(元)</div>
              <div class="tb_row">总销售总额(元)</div>
              <div class="tb_row middle">更新日期</div>
              <div class="tb_row middle"
                style="flex:1.5;">操作</div>
            </div>
            <template v-for="itemPro in productList">
              <div class="tb_content"
                style="cursor: pointer;"
                :key="itemPro.id"
                @click="showOnly(itemPro.id)">
                <div class="tb_row middle">{{itemPro.product_code}}</div>
                <div class="tb_row tb_col"
                  style="align-items:flex-start">
                  <span style="color:#1a95ff">{{itemPro.name}}</span>
                  <span>{{itemPro.style_code}}</span>
                </div>
                <div class="tb_row middle">
                  <zh-img-list :list="itemPro.image"></zh-img-list>
                </div>
                <div class="tb_row"
                  style="font-weight:bolder;font-size:16px">{{itemPro.total_number}}</div>
                <div class="tb_row">{{itemPro.sell_total_number || 0}}</div>
                <div class="tb_row"
                  style="color:#1a95ff">{{itemPro.sell_avg_price || 0}}</div>
                <div class="tb_row"
                  style="color:#01B48C">{{itemPro.sell_total_price || 0}}</div>
                <div class="tb_row middle">{{itemPro.updated_time}}</div>
                <div class="tb_row middle"
                  style="flex:1.5;">
                  <span class="tb_handle_btn blue"
                    @click.stop="addPro(itemPro.id,'',1)">入库</span>
                  <span class="tb_handle_btn blue"
                    @click.stop="addPro(itemPro.id,'',2)">出库</span>
                  <span class="tb_handle_btn orange"
                    @click.stop="goUpdatePro(itemPro)">修改</span>
                  <span class="tb_handle_btn red"
                    @click="deleteProReal(itemPro.id)">删除</span>
                </div>
              </div>
              <div class="collapse_item"
                :key="`transition-${itemPro.id}`">
                <el-collapse-transition>
                  <div v-if="itemPro.show">
                    <div class="tableTopBtnCtn">
                      <div class="btn noBorder"
                        @click="addProForBatch(itemPro,1)">批量入库</div>
                      <div class="btn noBorder"
                        @click="addProForBatch(itemPro,2)">批量出库</div>
                    </div>
                    <div class="tableCtnLv2">
                      <div class="tb_header">
                        <span class="tb_row max40">
                          <el-checkbox v-model="itemPro.checkedAll"
                            @change="(e)=>{
                              itemPro.size_info.forEach(itemS=>itemS.checked = e)
                              $forceUpdate()
                              }" />
                        </span>
                        <span class="tb_row">尺码配色</span>
                        <span class="tb_row">当前库存数量(件)</span>
                        <span class="tb_row">入库均价(元)</span>
                        <span class="tb_row">入库总价(元)</span>
                        <span class="tb_row">已出库数量(件)</span>
                        <span class="tb_row">出库均价(元)</span>
                        <span class="tb_row">出库总价(元)</span>
                        <span class="tb_row middle">操作</span>
                      </div>
                      <div class="tb_content"
                        v-for="(itemSC,indexSC) in itemPro.size_info"
                        :key="indexSC">
                        <span class="tb_row max40">
                          <el-checkbox v-model="itemSC.checked"
                            @change="$forceUpdate()" />
                        </span>
                        <span class="tb_row">{{`${itemSC.size_name}/${itemSC.color_name}`}}</span>
                        <span class="tb_row"
                          style="font-weight:bolder;font-size:16px">{{itemSC.total_number}}</span>
                        <span class="tb_row">{{itemSC.avg_price}}</span>
                        <span class="tb_row">{{itemSC.total_price}}</span>
                        <span class="tb_row">{{itemSC.sell_number}}</span>
                        <span class="tb_row">{{itemSC.sell_avg_price}}</span>
                        <span class="tb_row">{{itemSC.sell_total_price}}</span>
                        <span class="tb_row middle">
                          <span class="tb_handle_btn blue"
                            @click="addPro(itemPro.id,itemSC.id,1)">入库</span>
                          <span class="tb_handle_btn blue"
                            @click="addPro(itemPro.id,itemSC.id,2)">出库</span>
                          <span class="tb_handle_btn red"
                            @click="deleteSizeColor(itemSC.id)">删除</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>

              </div>
            </template>
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
                      filterable
                      remote
                      :remote-method="searchProList"
                      @change="getColorSize"
                      v-model="item.id">
                      <el-option v-for="item in proSelectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">操作类型</span>
                    <span class="explanation">(必填)</span>
                  </div>
                  <div class="content">
                    <el-select placeholder="请选择操作类型"
                      v-model="item.type">
                      <el-option :value='1'
                        label="入库"></el-option>
                      <el-option :value='2'
                        label="出库"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="colCtn">
                  <div class="label">
                    <span class="text">出入库单位</span>
                    <span class="explanation">(选填)</span>
                  </div>
                  <div class="content">
                    <el-input placeholder="请输入出入库单位名称"
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
                      v-model="itemChild.colorSize">
                      <el-option v-for="(itemSize,indexSize) in getColorSize(item.id)"
                        :label="itemSize.size_name + '/' + itemSize.color_name"
                        :value="itemSize.id"
                        :key="indexSize"></el-option>
                    </el-select>
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
                    <el-select placeholder="请选择仓库/货架"
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
                @click="addPro()">添加出入库</span>
              <span v-if="addProFlag"
                class="once cancle"
                @click="cancle">取消</span>
              <span v-if="addProFlag"
                class="once normal"
                @click="addPro">添加出入库</span>
              <span v-if="addProFlag"
                class="once ok"
                @click="saveLog">保存</span>
            </div>
          </div>
        </div>
        <div class="pageCtn">
          <el-pagination background
            :page-size="5"
            layout="prev, pager, next"
            :total="totalPro"
            :current-page.sync="pagePro"
            @current-change="getProList">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="module"
      v-else>
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
              v-model="storeName"
              @change="getStoreLogList"
              placeholder="请输入产品名称查询"></el-input>
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
              @click="reset('store')">重置</div>
          </div>
          <div class="leftCtn">
            <div class="btn noBorder"
              @click="deleteLog(null,true)">批量删除</div>
            <div class="btn noBorder"
              @click="printTable()">批量打印</div>
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
                  <div class="tcolumn">产品编号</div>
                  <div class="tcolumn">名称/款号</div>
                  <div class="tcolumn">仓库名称</div>
                  <div class="tcolumn">尺码颜色</div>
                  <div class="tcolumn">单价</div>
                  <div class="tcolumn">数量</div>
                  <div class="tcolumn">总价</div>
                  <div class="tcolumn">操作类型</div>
                  <div class="tcolumn">出入库单位</div>
                  <div class="tcolumn">操作时间</div>
                  <div class="tcolumn center">操作</div>
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
                  <div class="tcolumn"
                    style="color:#1a95ff;">
                    <span>{{item.product_info.product_code}}</span></div>
                  <div class="tcolumn">
                    <span style="color:#1a95ff">{{item.product_info.name}}</span>
                    <span>{{item.product_info.style_code}}</span>
                  </div>
                  <div class="tcolumn">{{item.store_name}}</div>
                  <div class="tcolumn">{{item.size_info.size_name}}/{{item.size_info.color_name}}</div>
                  <div class="tcolumn">{{item.price}}元</div>
                  <div class="tcolumn">{{item.number}}</div>
                  <div class="tcolumn">{{parseInt(item.price*item.number)}}元</div>
                  <div class="tcolumn"
                    :style="item.action_type===1 ? 'color:#1a95ff':item.action_type===2?'color:rgb(1, 180, 140)':item.action_type===3?'color:rgb(245, 34, 45)':''">{{actionArr[item.action_type]}}</div>
                  <div class="tcolumn">{{item.client_name}}</div>
                  <div class="tcolumn">{{$getTime(item.created_at)}}</div>
                  <div class="tcolumn center"
                    style="flex-direction: row;align-items: center;justify-content: space-around;">
                    <span style="color:#F5222D;cursor:pointer"
                      @click="deleteLog(item.id)">删除</span>
                    <el-popover placement="top-start"
                      width="200"
                      trigger="click">
                      <div>操作人：{{item.user_name}}</div>
                      <div>备注：{{item.desc}}</div>
                      <span slot="reference"
                        style="color:#1A95FF;cursor:pointer">详情</span>
                    </el-popover>
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
        <div class="content"
          style="padding-right:100px">
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
              <el-autocomplete style="margin-right:12px"
                v-model="itemChild.size"
                :fetch-suggestions="querySearchSize"
                placeholder="尺码"></el-autocomplete>
              <el-autocomplete style="margin-right:12px"
                v-model="itemChild.color"
                :fetch-suggestions="querySearchColor"
                placeholder="颜色"></el-autocomplete>
              <el-input v-model="itemChild.price"
                placeholder="单价">
                <template slot="append">元</template>
              </el-input>
              <el-input v-model="itemChild.number"
                placeholder="数量"></el-input>
            </div>
            <div class="editBtn blue"
              @click="productInfo.childrenArr.push($clone(itemChild))">复制</div>
            <div v-if="indexChild===0"
              class="editBtn blue"
              style="right: calc(-2em - 48px);"
              @click="createChild(productInfo.childrenArr)">添加</div>
            <div v-if="indexChild>0"
              class="editBtn red"
              style="right: calc(-2em - 48px);"
              @click="deleteChild(productInfo.childrenArr,indexChild)">删除</div>
          </div>
          <div class="row">
            <div class="label">存放仓库：</div>
            <div class="info">
              <el-select placeholder="请选择存放仓库"
                v-model="productInfo.store_id">
                <el-option v-for="item in stockArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">供应商单位：</div>
            <div class="info">
              <el-autocomplete class="inline-input"
                v-model="productInfo.client_name"
                :fetch-suggestions="querySearchClient"
                placeholder="请输入供应商单位"></el-autocomplete>
            </div>
          </div>
          <div class="row">
            <div class="label">上传图片：</div>
            <div class="info"
              style="padding-top:5px">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :file-list="productInfo.image"
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
        <div class="content"
          style="padding-right:100px">
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
              <el-autocomplete style="margin-right:12px"
                v-model="itemChild.size"
                :disabled='itemChild.disabled'
                :fetch-suggestions="querySearchSize"
                placeholder="尺码"></el-autocomplete>
              <el-autocomplete style="margin-right:12px"
                v-model="itemChild.color"
                :disabled='itemChild.disabled'
                :fetch-suggestions="querySearchColor"
                placeholder="颜色"></el-autocomplete>
              <!-- <el-input v-model="itemChild.price"
                placeholder="单价"></el-input>
              <el-input v-model="itemChild.number"
                :disabled='itemChild.disabled'
                placeholder="数量"></el-input> -->
            </div>
            <div class="editBtn blue"
              @click="updateInfo.childrenArr.push({size:itemChild.size,color:itemChild.color})">复制</div>
            <div v-if="indexChild===0"
              style="right: calc(-2em - 48px);"
              class="editBtn blue"
              @click="createChild(updateInfo.childrenArr)">添加</div>
            <div v-if="indexChild>0 && !itemChild.disabled"
              style="right: calc(-2em - 48px);"
              class="editBtn red"
              @click="deleteChild(updateInfo.childrenArr,indexChild)">删除</div>
          </div>
          <!-- <div class="row">
            <div class="label">选择仓库：</div>
            <div class="info">
              <el-select placeholder="请选择仓库"
                v-model="updateInfo.store_id">
                <el-option v-for="item in stockArr"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"></el-option>
              </el-select>
            </div>
          </div>
          <div class="row">
            <div class="label">出入库单位：</div>
            <div class="info">
              <el-autocomplete class="inline-input"
                v-model="productInfo.client_name"
                :fetch-suggestions="querySearchClient"
                placeholder="请输入出入库单位"></el-autocomplete>
            </div>
          </div> -->
          <div class="row">
            <div class="label">上传图片：</div>
            <div class="info"
              style="padding-top:5px">
              <el-upload class="upload"
                action="https://upload.qiniup.com/"
                accept="image/jpeg,image/gif,image/png,image/bmp"
                :before-upload="beforeAvatarUpload"
                :file-list="fileArrUpadate"
                :on-success="successFileUpdate"
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
import { downloadExcel } from '@/assets/js/common.js'
export default {
  data () {
    return {
      loading: true,
      proSelectList: [], // 产品远程搜索下拉框
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
        client_name: '',
        store_id: '',
        image: []
      },
      updateInfo: {
        name: '',
        type: '',
        client_name: '',
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
      clientName: '',
      productList: [],
      storeLogList: [],
      fileArr: [],
      fileArrUpadate: [],
      addArr: [],
      deleteArr: [],
      stockArr: [],
      postData: { token: '' },
      checkAll: false,
      actionArr: ['', '入库', '销售/出库'],
      localSizeArr: [],
      localColorArr: [],
      localClientArr: [],
      // 2020-08-06-16-34新增
      showProList: true
    }
  },
  methods: {
    showOnly (id) {
      this.productList.forEach(itemF => {
        if (itemF.id === id) {
          itemF.show = !itemF.show
        } else {
          itemF.show = false
        }
      })
      this.$forceUpdate()
    },
    querySearchClient (queryString, cb) {
      cb(queryString ? this.addValue(this.localClientArr.filter(this.createFilter(queryString))) : this.addValue(this.localClientArr))
    },
    querySearchColor (queryString, cb) {
      cb(queryString ? this.addValue(this.localColorArr.filter(this.createFilter(queryString))) : this.addValue(this.localColorArr))
    },
    querySearchSize (queryString, cb) {
      cb(queryString ? this.addValue(this.localSizeArr.filter(this.createFilter(queryString))) : this.addValue(this.localSizeArr))
    },
    createFilter (queryString) {
      return (obj) => {
        return (obj.indexOf(queryString) === 0)
      }
    },
    // 批量打印
    printTable (data) {
      data = data || this.storeLogList.filter(itemF => itemF.check).map(itemM => itemM.id)
      if (data.length === 0) {
        this.$message.warning('请选择需要打印的日志')
        return
      }
      window.open(`/print/goStockProTable/${data.join('-')}`)
    },
    // 能把数组转为对象数组
    addValue (arr) {
      return arr.map((item) => {
        return {
          value: item
        }
      })
    },
    getLocal (type, name) {
      if (type === 'size') {
        if (this.localSizeArr.indexOf(name) !== -1) {
          return
        }
        this.localSizeArr.push(name)
        window.localStorage.setItem('size', JSON.stringify(this.localSizeArr))
      }
      if (type === 'color') {
        if (this.localColorArr.indexOf(name) !== -1) {
          return
        }
        this.localColorArr.push(name)
        window.localStorage.setItem('color', JSON.stringify(this.localColorArr))
      }
      if (type === 'client') {
        if (this.localClientArr.indexOf(name) !== -1) {
          return
        }
        this.localClientArr.push(name)
        window.localStorage.setItem('client', JSON.stringify(this.localClientArr))
      }
    },
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
        item.time = this.$getTime(item.created_at)
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
    getColorSize (id) {
      if (!id) {
        return []
      }
      return this.proSelectList.find((item) => Number(item.id) === Number(id)).size_info
    },
    checkAllLog (flag) {
      this.storeLogList.forEach((item) => {
        item.check = flag
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
      outAndIn.list({
        client_name: this.clientName,
        keyword: this.storeName,
        start_time: this.storeDate,
        end_time: y + '-' + m + '-' + d,
        page: this.pageStoreLog,
        limit: 10
      }).then((res) => {
        this.storeLogList = res.data.data
        this.totalStoreLog = res.data.meta.total
        this.loading = false
      })
    },
    getProList () {
      this.loading = true
      var date = new Date()
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      product.list({
        keyword: this.proName,
        start_time: this.proDate,
        end_time: y + '-' + m + '-' + d,
        page: this.pagePro,
        limit: 5
      }).then((res) => {
        this.productList = res.data.data.map(itemM => {
          itemM.total_number = this.$toFixed(itemM.size_info.map(itemS => (+itemS.total_number || 0)).reduce((a, b) => {
            return a + b
          }, 0))
          itemM.sell_total_number = this.$toFixed(itemM.size_info.map(itemS => (+itemS.sell_number || 0)).reduce((a, b) => {
            return a + b
          }, 0))
          itemM.sell_total_price = this.$toFixed(itemM.size_info.map(itemS => (+itemS.sell_total_price || 0)).reduce((a, b) => {
            return a + b
          }, 0))
          itemM.sell_avg_price = this.$toFixed(itemM.sell_total_price / itemM.sell_total_number)
          itemM.updated_time = this.$getTime(itemM.size_info.map(itemS => (itemS.update_time ? new Date(itemS.update_time).getTime() : 0)).sort((a, b) => {
            return a - b
          })[0])
          itemM.show = false
          return itemM
        })
        this.proSelectList = res.data.data
        this.totalPro = res.data.meta.total
        this.loading = false
      })
    },
    getStoreList () {
      store.list().then((res) => {
        this.stockArr = res.data.data
      })
    },
    cancle () {
      this.productData = []
      this.addProFlag = false
    },
    totalPrice (arr) {
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
        id: Number(id) || '',
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
    addProForBatch (item, type) {
      if (!this.addProFlag) {
        this.addProFlag = true
      }
      this.productData.push({
        id: Number(item.id) || '',
        type: type || '',
        client: '',
        store_id: '',
        desc: '',
        childrenArr: item.size_info.filter(itemF => itemF.checked).map(itemM => {
          return {
            colorSize: Number(itemM.id) || '',
            number: '',
            price: ''
          }
        })
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
    deleteSizeColor (id) {
      // 删除尺码配色需要判断库存数量为0
      this.$confirm('是否确认要删除该产品，在删除之前请确认该尺码配色没有任何出入库操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        product.deleteSize({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getProList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
    successFileUpdate (response, file, fileList) {
      this.addArr.push('https://zhihui.tlkrzf.com/' + response.key)
    },
    beforeRemove (file, fileList) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteArr.push({
          id: file.id ? file.id : null,
          file_name: file.response ? file.response.key : file.url.split('https://zhihui.tlkrzf.com/')[1]
        })
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // return false 禁用自带的删除功能
      return false
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
        // if (!item.price) {
        //   errorMsg = '单价未填写'
        // }
      })
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      const data = this.productInfo
      const formData = {
        name: data.name,
        image: {
          file_data: data.image,
          delete_data: []
        },
        client_name: data.client_name,
        style_code: data.type,
        store_id: data.store_id,
        size_info: data.childrenArr.map((item) => {
          return {
            size_name: item.size,
            color_name: item.color,
            number: item.number,
            price: item.price || 0
          }
        })
      }
      product.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
          this.resetPro()
          this.getLocal('client', data.client_name)
          formData.size_info.forEach((item) => {
            this.getLocal('size', item.size_name)
            this.getLocal('color', item.color_name)
          })
        }
        this.createProFlag = false
        this.getProList()
        this.getStoreLogList()
        this.$confirm('是否去打印相关成衣出入库单?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.printTable(res.data.data)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    resetPro () {
      this.productInfo = {
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
      }
    },
    goUpdatePro (item) {
      this.updateInfo = {
        id: item.id,
        name: item.name,
        type: item.style_code,
        childrenArr: item.size_info.map((itemChild) => {
          return {
            disabled: true,
            color: itemChild.color_name,
            size: itemChild.size_name,
            number: itemChild.total_number,
            price: itemChild.avg_price
          }
        }),
        store_id: '',
        client_name: '',
        image: item.image
      }
      this.fileArrUpadate = item.image.map(item => {
        return {
          id: item.id,
          url: item.image_url
        }
      })
      this.updateProFlag = true
    },
    deleteProReal (id) {
      this.$confirm('是否确认要删除该产品，在删除之前请确认该产品没有任何出入库操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        product.delete({
          id: id
        }).then((res) => {
          if (res.data.status) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getProList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    searchProList (query) {
      product.list({
        keyword: query,
        limit: 20,
        page: 1
      }).then((res) => {
        this.proSelectList = res.data.data
      })
    },
    updatePro () {
      let errorMsg = ''
      if (!this.updateInfo.name) {
        errorMsg = '请填写产品名称'
      }
      if (this.updateInfo.store_id) {
        this.updateInfo.childrenArr.forEach((item) => {
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
      }
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      const data = this.updateInfo
      const formData = {
        id: data.id,
        name: data.name,
        image: {
          file_data: this.addArr,
          delete_data: this.deleteArr
        },
        style_code: data.type,
        store_id: data.store_id,
        client_name: data.client_name,
        size_info: data.childrenArr.filter(itemF => !itemF.disabled).map((item) => {
          return {
            size_name: item.size,
            color_name: item.color,
            number: 0,
            price: 0
          }
        })
      }
      product.create(formData).then((res) => {
        if (res.data.status) {
          this.$message.success('修改成功')
        }
        this.updateProFlag = false
        this.getProList()
        this.$forceUpdate()
      })
    },
    saveStore () {
      if (!this.storeInfo.name) {
        this.$message.error('请填写仓库名称')
      }
      store.create({
        id: null,
        name: this.storeInfo.name,
        type: 1
      }).then((res) => {
        if (res.data.status) {
          this.$message.success('添加成功')
        }
        this.createStoreFlag = false
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
          if (!itemChild.colorSize) {
            errorMsg = '请选择产品尺码颜色'
          }
          if (!itemChild.number) {
            errorMsg = '请填写数量'
          }
          // if (!itemChild.price) {
          //   errorMsg = '请填写价格，如果没有价格请填0'
          // }
        })
      })
      if (errorMsg) {
        this.$message.error(errorMsg)
        return
      }
      const formData = this.productData.map((item) => {
        return {
          product_id: item.id,
          store_id: item.store_id,
          client_name: item.client,
          desc: item.desc,
          action_type: item.type,
          size_info: item.childrenArr.map((itemChild) => {
            return {
              size_id: itemChild.colorSize,
              price: itemChild.price || 0,
              number: itemChild.number
            }
          })
        }
      })
      outAndIn.create({
        data: formData
      }).then((res) => {
        if (res.data.status !== false) {
          this.$message.success('添加成功')
          this.productData = []
          this.addProFlag = false
          this.getProList()
          this.getStoreLogList()
          this.$confirm('是否去打印相关成衣出入库单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.printTable(res.data.data)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
          this.$forceUpdate()
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
        this.clientName = ''
        this.getStoreLogList()
      }
    }
  },
  created () {
    this.localClientArr = JSON.parse(window.localStorage.getItem('client')) || []
    this.localColorArr = JSON.parse(window.localStorage.getItem('color')) || []
    this.localSizeArr = JSON.parse(window.localStorage.getItem('size')) || []
    Promise.all([
      getToken(),
      store.list({
        type: 1
      }),
      product.list({
        limit: 5,
        page: 1
      }),
      outAndIn.list({
        limit: 10,
        page: 1
      })
    ]).then((res) => {
      this.postData.token = res[0].data.data
      this.stockArr = res[1].data.data
      this.productList = res[2].data.data.map(itemM => {
        itemM.total_number = this.$toFixed(itemM.size_info.map(itemS => (+itemS.total_number || 0)).reduce((a, b) => {
          return a + b
        }, 0))
        itemM.sell_total_number = this.$toFixed(itemM.size_info.map(itemS => (+itemS.sell_number || 0)).reduce((a, b) => {
          return a + b
        }, 0))
        itemM.sell_total_price = this.$toFixed(itemM.size_info.map(itemS => (+itemS.sell_total_price || 0)).reduce((a, b) => {
          return a + b
        }, 0))
        itemM.sell_avg_price = this.$toFixed(itemM.sell_total_price / itemM.sell_total_number)
        itemM.updated_time = this.$getTime(itemM.size_info.map(itemS => (itemS.update_time ? new Date(itemS.update_time).getTime() : 0)).sort((a, b) => {
          return a - b
        })[0])
        itemM.show = false
        return itemM
      })
      this.proSelectList = res[2].data.data
      this.totalPro = res[2].data.meta.total
      this.storeLogList = res[3].data.data
      this.totalStoreLog = res[3].data.meta.total
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import "~@/assets/less/storeDetail.less";
</style>

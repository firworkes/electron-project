<template>
  <div>
    <template>
      <a-form :form="form">
        <div class="searchTerm">
          <!-- 日期段 -->
          <a-form-item label="日期段：">
            <a-range-picker
              @change="dateChange"
              :style="{width: '250px', marginRight: '20px'}"
              :placeholder="['开始时间','结束时间']"
              v-decorator="[
                  'startTime', 
                  { initialValue: timeValue}
                            ]"
              size="small"
              class="loss-time"
            />
          </a-form-item>
          <!-- 时间段 -->
          <a-form-item label="时间段：">
            <a-select
              showSearch
              placeholder="全时段"
              optionFilterProp="children"
              :style="{width: '150px', marginRight: '20px'}"
              size="small"
              v-decorator="[
                    'intervalType', // 给表单赋值或拉取表单时，该input对应的key
                ]"
            >
              <a-select-option value="LUNCH">午</a-select-option>
              <a-select-option value="DINNER">晚</a-select-option>
            </a-select>
          </a-form-item>
          <div v-for="(item,index) in date" :key="item.index" style="lineHeight: 39.33px">
            <a-button @click="todayBtn(index)" style="marginRight: 10px" size="small">{{ item }}</a-button>
          </div>
        </div>
        <div class="searchTerm">
          <!-- 门店 -->
          <a-form-item label="门店：">
            <a-select
              showSearch
              placeholder="请选择"
              optionFilterProp="children"
              :style="{width: '265px', marginRight: '20px'}"
              size="small"
              v-decorator="[
                    'storeId', // 给表单赋值或拉取表单时，该input对应的key
                ]"
            >
              <a-select-option v-for="item in shop" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>

          <!-- 部门 -->
          <a-form-item label="部门：">
            <a-select
              showSearch
              placeholder="请选择"
              optionFilterProp="children"
              :style="{width: '265px', marginRight: '20px'}"
              size="small"
              v-decorator="[
                    'restaurantId', // 给表单赋值或拉取表单时，该input对应的key
                ]"
            >
              <a-select-option
                v-for="item in branch"
                :key="item.id"
                :value="item.id"
              >{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
        </div>
        <a-form-item class="search">
          <a-button class="searchBtn" @click="serachBtn" html-type="submit">查询</a-button>
          <a-button @click="reset">取消</a-button>
          <a-button class="exportBtn" @click="exportToExcel">导出</a-button>
        </a-form-item>
      </a-form>
    </template>
    <template>
      <div class="dining-data">
        <a-card style="width: 270px">
          <div :style="{display: 'flex', justifyContent: 'space-between'}">
            <p>总营业额</p>
            <span style="cursor:pointer" @click="openNotification(1)" title="逻辑公式">
              <a-icon type="info-circle" />
            </span>
          </div>
          <p
            :style="{fontSize: '28px',fontWeight: 'bold',color: '#F59A23',marginBottom: '25px'}"
          >{{turnover}}</p>
          <p :style="{borderTop: '1px solid #ccc',paddingTop: '10px'}">总应收金额 ¥ {{ receivable }}</p>
          <p>折扣率 {{ discountRate }}%</p>
        </a-card>
        <a-card style="width: 270px">
          <div :style="{display: 'flex', justifyContent: 'space-between'}">
            <p>总优惠金额</p>
            <span style="cursor:pointer" @click="openNotification(2)" title="逻辑公式">
              <a-icon type="info-circle" />
            </span>
          </div>
          <p :style="{fontSize: '28px',fontWeight: 'bold',marginBottom: '25px'}">{{ totalDiscount }}</p>
          <p :style="{borderTop: '1px solid #ccc',paddingTop: '10px'}">优惠券 ¥ {{ coupon }}</p>
          <p>积分抵扣 ¥ {{ points }}</p>
          <p>折扣金额 ¥ {{discount }}</p>
          <p>扣减金额 ¥ {{ deduction }}</p>
        </a-card>
        <a-card style="width: 270px">
          <div :style="{display: 'flex', justifyContent: 'space-between'}">
            <p>人均消费金额（AC）</p>
            <span style="cursor:pointer" @click="openNotification(3)" title="逻辑公式">
              <a-icon type="info-circle" />
            </span>
          </div>
          <p
            :style="{fontSize: '28px',fontWeight: 'bold',color: '#F59A23',marginBottom: '25px'}"
          >{{ consumptionPerPerson }}</p>
          <p :style="{borderTop: '1px solid #ccc',paddingTop: '10px'}">总营业额 {{ turnover }}</p>
          <p>总用餐人数 {{ consumerCount }}</p>
        </a-card>
        <a-card style="width: 270px">
          <div :style="{display: 'flex', justifyContent: 'space-between'}">
            <p>人均菜品消费数量（SMTC/TC)</p>
            <span style="cursor:pointer" @click="openNotification(4)" title="逻辑公式">
              <a-icon type="info-circle" />
            </span>
          </div>
          <p
            :style="{fontSize: '28px',fontWeight: 'bold',marginBottom: '25px'}"
          >{{ foodConsumptionPerPerson }}</p>
          <p :style="{borderTop: '1px solid #ccc',paddingTop: '10px'}">总用餐人数 {{ consumerCount }}</p>
          <p>总菜品消费数量 {{ totalFoodCount }}</p>
        </a-card>
      </div>
    </template>
    <!-- 表格 -->
    <ITable
      ref="table"
      :operates="operates"
      :list="list"
      :columns="columns"
      :options="options"
      :paging="paging"
      @pageChange="pageChange"
      @showSizeChange="onShowSizeChange"
    ></ITable>
  </div>
</template>

<script>
import { WorkBasicsDataApi, DataStatisticsApi, branchApi } from '@/apis/api'
import ITable from '@/components/ITable'
import { ExcelTool } from '@/assets/excel/ExcelTool'

import moment from 'moment'

const columns = [
  {
    key: '1',
    title: '时间',
    dataIndex: 'createdAt',
    width: 120
  },
  {
    key: '2',
    title: '时间段',
    dataIndex: 'intervalType',
    width: 100
  },
  {
    key: '3',
    title: '门店',
    dataIndex: 'storeName',
    width: 190
  },
  {
    key: '4',
    title: '部门',
    dataIndex: 'restaurantName',
    width: 230
  },
  {
    key: '5',
    title: '订单号',
    dataIndex: 'orderId',
    width: 200
  },
  {
    key: '6',
    title: '实收金额(SL)',
    dataIndex: 'receipts',
    width: 100
  },
  {
    key: '7',
    title: '应收金额',
    dataIndex: 'receivable',
    width: 100
  },
  {
    key: '8',
    title: '优惠小计',
    dataIndex: 'discountSubtotal',
    width: 100
  },
  {
    key: '9',
    title: '优惠券',
    dataIndex: 'coupon',
    width: 100
  },
  {
    key: '10',
    title: '积分抵扣',
    dataIndex: 'points',
    width: 100
  },
  {
    key: '11',
    title: '折扣金额',
    dataIndex: 'discount',
    width: 100
  },
  {
    key: '12',
    title: '支付方式',
    dataIndex: 'paymentType',
    width: 150
  },
  {
    key: '13',
    title: '扣减金额',
    dataIndex: 'deduction',
    width: 100
  },
  {
    key: '14',
    title: '菜品数量',
    dataIndex: 'address',
    width: 100
  },
  {
    key: '15',
    title: '消费人数(TC)',
    dataIndex: 'foodCount',
    width: 130
  },
  {
    key: '16',
    title: '人均消费(AC)',
    dataIndex: 'consumptionPerPerson',
    width: 130
  },
  {
    key: '17',
    title: '会员信息',
    dataIndex: 'memberInfo',
    width: 200
  },
  {
    key: '18',
    title: '备注'
  }
]

const list = []

export default {
  data () {
    this.cacheData = list.map(item => ({ ...item }))
    return {
      flagDate: true, // 今日，昨日...日期标杆
      timeValue: [], // 开始，结束时间
      form: this.$form.createForm(this),
      date: ['今日', '昨日', '上周', '上月'],

      // 统计数据
      turnover: null, // 总营业额
      totalDiscount: null, // 总优惠金额
      consumptionPerPerson: null, // 人均消费金额
      foodConsumptionPerPerson: null, // 人均菜品消费数量
      receivable: null, // 应收金额
      discountRate: null, // 折扣率
      coupon: null, // 优惠券
      points: null, // 积分抵扣
      discount: null, // 折扣金额
      deduction: null, // 扣减金额
      consumerCount: null, // 总用餐人数
      totalFoodCount: null, // 总菜品消费数量

      branch: [], // 部门
      list, // 数据列表
      columns, // 数据title
      options: {
        // 表格配置项
        loading: false,
        scroll: { x: 2420 },
        editShow: false
      },
      operates: [
        // 事件函数
        {
          id: '0',
          method: (value, key, col) => {
            this.handleChange(value, key, col)
          }
        },
        {
          id: '1',
          name: '保存',
          method: key => {
            this.save(key)
          }
        },
        {
          id: '2',
          name: '取消',
          method: key => {
            this.cancel(key)
          }
        },
        {
          id: '3',
          name: '编辑',
          method: key => {
            this.edit(key)
          }
        },
        {
          id: '4',
          name: '明细',
          method: key => {
            this.restsBtn(key)
          }
        }
      ],
      // 分页
      paging: {
        page: 1, // 当前页数
        size: 10, // 页面数据条数
        total: 0, // 数据总数
        pageSizeOptions: [
          '10',
          '20',
          '30',
          '40',
          '50',
          '60',
          '70',
          '80',
          '90',
          '100'
        ]
      }
    }
  },
  created () {
    this.searchList(this.paging.page, this.paging.size)

    // 数据统计
    this.DataStatisticList()

    // 数据初始化
    this.$store.dispatch('shopList')

    // 部门
    branchApi().then(({ data }) => {
      this.branch = data
    })
  },
  components: {
    ITable
  },

  methods: {
    // 下一页
    pageChange (current) {
      this.form.validateFields((value) => {
        this.paging.page = current
        if (this.flagDate) {
          this.searchList(
            this.paging.page,
            this.paging.size,
            this.timeValue[0],
            this.timeValue[1],
            value.intervalType,
            value.storeId,
            value.restaurantId
          )
        } else {
          this.searchList(
            this.paging.page,
            this.paging.size,
            this.timeValue[0]._i,
            this.timeValue[1]._i,
            value.intervalType,
            value.storeId,
            value.restaurantId
          )
        }
      })
    },
    // 修改每页数量
    onShowSizeChange (current, pageSize) {
      this.form.validateFields((err, value) => {
        this.paging.size = current

        if (this.flagDate) {
          this.searchList(
            this.paging.page,
            this.paging.size,
            this.timeValue[0],
            this.timeValue[1],
            value.intervalType,
            value.storeId,
            value.restaurantId
          )
        } else {
          this.searchList(
            this.paging.page,
            this.paging.size,
            this.timeValue[0]._i,
            this.timeValue[1]._i,
            value.intervalType,
            value.storeId,
            value.restaurantId
          )
        }
      })
    },

    // 封装统计数据
    DataStatisticList (newStartTime, newEndTime, newIntervalType, newStoreId) {
      DataStatisticsApi({
        params: {
          startTime: newStartTime,
          endTime: newEndTime,
          intervalType: newIntervalType,
          storeId: newStoreId
        }
      })
        .then(res => {
          let data = res.data
          if (data) {
            this.turnover = data.turnover
            this.totalDiscount = data.totalDiscount
            this.consumptionPerPerson = data.consumptionPerPerson
            this.foodConsumptionPerPerson = data.foodConsumptionPerPerson
            this.receivable = data.receivable
            this.discountRate = data.discountRate
            this.coupon = data.coupon
            this.points = data.points
            this.discount = data.discount
            this.deduction = data.deduction
            this.consumerCount = data.consumerCount
            this.totalFoodCount = data.totalFoodCount
          }
        })
        .catch(err => {
          if (err) {
            this.$message.error(err.message)
          }
        })
    },

    // 统计数据逻辑公式
    openNotification (index) {
      if (index === 3) {
        this.$notification.open({
          message: '人均消费金额（AC）',
          description: '人均消费金额 AC = 总营业额 SL ÷ 总用餐人数'
        })
      } else if (index === 4) {
        this.$notification.open({
          message: '人均菜品消费数量（SMTC/TC)',
          description: '人均菜品消费数量 = 总菜品消费数量 ÷ 总用餐人数'
        })
      }
    },

    // 选择日期
    dateChange (value, time) {
      this.timeValue = time
    },
    // 封装数据
    searchList (
      newPage,
      newSize,
      firstDate,
      lastDate,
      newIntervalType,
      newStoreId,
      newRestaurantId
    ) {
      this.options.loading = true
      WorkBasicsDataApi({
        params: {
          page: newPage,
          size: newSize,
          startTime: firstDate,
          endTime: lastDate,
          intervalType: newIntervalType,
          storeId: newStoreId,
          restaurantId: newRestaurantId
        }
      })
        .then(res => {
          if (res.data.content.length > 0) {
            this.list = res.data.content

            this.paging.total = res.data.totalElements
            this.paging.total = parseInt(this.paging.total)
          }
          this.options.loading = false
        })
        .catch(err => {
          if (err) {
            this.$message.error(err.message)
          }
        })
    },
    // 今日，昨日，上周，上月
    todayBtn (index) {
      this.flagDate = false
      var today = new Date()
      var yesterday = null // 昨日
      var lastWeek = null // 上周
      var newDay = today.getDate() // 当前日
      var newMonth = today.getMonth() + 1 // 当前月
      var newYear = today.getFullYear() // 当前年

      today.setTime(today.getTime())
      var newToday = newYear + '-' + newMonth + '-' + newDay // 今日
      if (index === 0) {
        this.timeValue = [moment(newToday), moment(newToday)]
        // 调用接口
        this.searchList(
          this.paging.page,
          this.paging.size,
          this.timeValue[0]._i,
          this.timeValue[1]._i
        )

        // 调用统计数据
        this.DataStatisticList(this.timeValue[0]._i, this.timeValue[1]._i)
      } else if (index === 1) {
        today.setTime(today.getTime() - 24 * 60 * 60 * 1000)
        yesterday =
          today.getFullYear() +
          '-' +
          (today.getMonth() + 1) +
          '-' +
          today.getDate()
        this.timeValue = [moment(yesterday), moment(newToday)]

        this.searchList(
          this.paging.page,
          this.paging.size,
          this.timeValue[0]._i,
          this.timeValue[1]._i
        )

        // 调用统计数据
        this.DataStatisticList(this.timeValue[0]._i, this.timeValue[1]._i)
      } else if (index === 2) {
        var newDayOfWeek = today.getDay() // 今天本周的第几天
        var monStartDate =
          newYear + '-' + newMonth + '-' + (newDay - newDayOfWeek - 6) // 上周一
        var sunStartDate =
          newYear + '-' + newMonth + '-' + (newDay - newDayOfWeek) // 上周日
        this.timeValue = [moment(monStartDate), moment(sunStartDate)]
        // 调用接口
        this.searchList(
          this.paging.page,
          this.paging.size,
          this.timeValue[0]._i,
          this.timeValue[1]._i
        )

        // 调用统计数据
        this.DataStatisticList(this.timeValue[0]._i, this.timeValue[1]._i)
      } else if (index === 3) {
        var Moth = new Date(newMonth, newMonth - 1, 0)
        var firstMonth = newYear + '-' + (newMonth - 1) + '-' + '01' // 上月初
        var lastMonth = newYear + '-' + (newMonth - 1) + '-' + Moth.getDate() // 上月底
        this.timeValue = [moment(firstMonth), moment(lastMonth)]
        // 调用接口
        this.searchList(
          this.paging.page,
          this.paging.size,
          this.timeValue[0]._i,
          this.timeValue[1]._i
        )

        // 调用统计数据
        this.DataStatisticList(this.timeValue[0]._i, this.timeValue[1]._i)
      }
    },

    // 查询
    serachBtn () {
      this.flagDate = true
      this.form.validateFields((err, value) => {
        if (!err) {
          this.searchList(
            this.paging.page,
            this.paging.size,
            this.timeValue[0],
            this.timeValue[1],
            value.intervalType,
            value.storeId,
            value.restaurantId
          )

          // 调用统计数据
          this.DataStatisticList(
            this.timeValue[0],
            this.timeValue[1],
            value.intervalType,
            value.storeId
          )
        }
      })
    },
    // 重置按钮
    reset () {
      this.flagDate = true
      this.timeValue = []
      this.form.resetFields()
      this.searchList(this.paging.page, this.paging.size)
      this.form.validateFields((err, value) => {
        // 调用统计数据
        this.DataStatisticList(
          this.timeValue[0],
          this.timeValue[1],
          value.intervalType,
          value.storeId
        )
      })
    },

    // 导出表格
    exportToExcel () {
      // excel数据导出
      let table = this.$refs.table.$el
      ExcelTool.exportTable(table, { colBegin: 1 })
    },

    // 明细
    restsBtn () {}
  },

  computed: {
    // 门店信息
    shop () {
      return this.$store.state.shop
    }
  }
}
</script>

<style lang="less" scoped>
.dining-data {
  display: flex;
  margin-bottom: 30px;
  overflow-x: auto;
  white-space: nowrap;
  .ant-card {
    margin-right: 30px;
  }
  p {
    margin: 0px;
  }
}
.ant-row {
  display: flex;
  margin-bottom: 10px;
}
.searchTerm {
  display: flex;
}
.search {
  height: 48px;
  margin-bottom: 24px;
  .searchBtn {
    background-color: #043927;
    border: 1px solid #043927;
    color: #fff;
    margin-right: 10px;
  }
  .exportBtn {
    margin-left: 24px;
  }
}
</style>
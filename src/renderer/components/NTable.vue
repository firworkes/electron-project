<template>
  <div>
    <template>
      <a-form layout="inline" :form="form" @submit="handleSubmit">
        <a-row :gutter="24">
          <slot name="form"></slot>
        </a-row>
        <a-row>
          <a-col style="margin: 18px 0px 16px 0px">
            <a-form-item :label-col="{ span: 12 }">
              <a-button type="primary" html-type="submit">查询</a-button>
              <a-button style="margin: 0px 24px 0px 10px" @click="reset">取消</a-button>
              <a-button v-if="addUrl" type="primary" style="margin-right: 10px" @click="addition">添加</a-button>
                <!-- 添加框 -->
              <a-modal
                width="680px"
                title="添加"
                :visible="visible"
                @ok="confirmAdd"
                @cancel="cancelAdd"
                :confirmLoading="confirmLoading"
                okText="确认"
                cancelText="取消"
              >
                <a-form layout="inline" :form="addForm">
                  <a-row style="padding-bottom: 30px" type="flex" justify="center">
                    <slot name="addForm"></slot>
                  </a-row>
                </a-form>
              </a-modal>
              <slot name="button"></slot>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </template>

    <slot name="content"></slot>

    <template>
      <a-table rowKey="id" :loading="$store.state.loading" size="small" :columns="columns" :dataSource="list" :pagination="false" :rowSelection="rowSelection" :scroll="scroll">
        <span slot="name" slot-scope="name">
          <span
            :style="{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',display: 'inline-block',
              width: '150px'
              }"
          >{{name}}</span>
        </span>
        <span slot="author" slot-scope="author">
          <span
            :style="{
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             whiteSpace: 'nowrap',
             display: 'inline-block',
             width: '100px'
             }"
          >{{author}}</span>
        </span>
        <span :slot="soltData">
          <slot name="tableSlot"></slot>
        </span>

        <template
          v-for="col in editData" :slot="col" slot-scope="text, record">
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => handleChange(e.target.value, record.orderId, col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => save(record.orderId)">保存</a>
              <a-popconfirm title="是否取消?" @confirm="() => cancel(record.orderId)">
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => edit(record.orderId)">编辑</a>
            </span>
            <span style="margin: 0px 5px">
              <a @click="() => delete(record.orderId)">删除</a>
            </span>
            <slot name="tableButton"></slot>
          </div>
        </template>
        <template v-if="footer" slot="footer">
          <div class="summation">
            <slot name="footer"></slot>
          </div>
        </template>

      </a-table>
    </template>
    <!-- 分页 -->
    <div class="book-page">
      <template>
        <a-pagination
          showSizeChanger
          @showSizeChange="onShowSizeChange"
          showQuickJumper
          :defaultCurrent="1"
          :total="total"
          @change="pageChange"
        />
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NTable',
  props: {
    columns: Array, // 表格标题
    url: Function, // 列表数据API
    addUrl: Function, // 添加API
    deletUrl: Function, // 删除API
    editData: Array, // 需要编辑的字段
    footer: Boolean, // 表格尾部
    rowSelection: Object, // 表格多选
    scroll: Object,
    soltData: String, // 表格中间内容插槽
    startTime: String, // 开始时间
    endTime: String // 结束时间

  },
  data () {
    return {

      form: this.$form.createForm(this),
      addForm: this.$form.createForm(this),
      list: [],
      total: 0,
      page: 1,
      size: 10,
      pageSizeOptions: [10, 40, 80, 120],
      cacheData: [],
      confirmLoading: false,
      visible: false
    }

    this.cacheData = this.list.map(item => ({ ...item }))
  },

  mounted () {
    this.tableList(this.page, this.size)
  },

  methods: {

    // 查询
    handleSubmit () {
      this.tableList(this.page, this.size)
    },

    reset () {
      this.form.resetFields()
      this.tableList(this.page, this.size)
    },

    // 列表数据
    tableList (newPage, newSize) {
      this.$store.commit('loadingTrue')
      this.form.validateFields((err, value) => {
        let params = value
        params.startTime = this.startTime
        params.endTime = this.endTime
        params.page = newPage
        params.size = newSize

        this.url({ params }).then(res => {
          if (res.code === 200000) {
            this.list = res.data.content
            this.total = res.data.totalElements
            this.total = parseInt(this.total)
          }
          this.$store.commit('loadingFalse')
        })
      })
    },

    // 下一页
    pageChange (current) {
      this.page = current

      this.tableList(this.page, this.size)
    },

    // 每页数量
    onShowSizeChange (current, pageSize) {
      this.size = pageSize
      this.tableList(this.page, this.size)
    },

    // 删除
    delete () {
      this.deletUrl()
        .then(res => {
          if (res.code === 200) {
            this.tableList(this.page, this.size)
            this.$message.success(res.message)
          }
        })
    },

    // 添加按钮弹出框
    addition () {
      this.visible = true
    },

    // 添加确定按钮
    confirmAdd () {
      this.addForm.validateFields((err, value) => {
        if (!err) {
          let params = value
          this.addUrl({params})
            .then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.tableList(this.page, this.size)
              }
            })
        }
      })
    },

    // 添加弹窗取消按钮
    cancelAdd () {
      this.visible = false
    },

    // 编辑INPUT事件
    handleChange (value, orderId, column) {
      const newData = [...this.list]
      const target = newData.filter(item => orderId === item.orderId)[0]
      if (target) {
        target[column] = value
        this.list = newData
      }
    },

    // 编辑
    edit (orderId) {
      const newData = [...this.list]
      const target = newData.filter(item => orderId === item.orderId)[0]
      if (target) {
        target.editable = true
        this.list = newData
      }
    },

    // 保存
    save (orderId) {
      const newData = [...this.list]
      const target = newData.filter(item => orderId === item.orderId)[0]
      if (target) {
        // let params = target
        // this.addUrl({params})
        //   .then( res => {
        //     if(res.code === 200) {
        //       this.$message.success(res.message)
        //       this.tableList(this.page, this.size);
        //     }
        //   })
        delete target.editable
        this.list = newData
        this.cacheData = newData.map(item => ({ ...item }))
      }
    },

    // 取消
    cancel (orderId) {
      const newData = [...this.list]
      const target = newData.filter(item => orderId === item.orderId)[0]
      if (target) {
        Object.assign(target, this.cacheData.filter(item => orderId === item.orderId)[0])
        delete target.editable
        this.list = newData
      }
    }

  }

}
</script>

<style lang="less" scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.book-page {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

.searchBtn {
    // background-color: #043927;
    border: 1px solid #043927;
    color: #fff;
    margin-right: 10px;
  }

.summation {
    display: flex;
    font-weight: bold;
  }
</style>
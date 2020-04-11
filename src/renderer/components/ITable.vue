<template>
  <div>
    <template>
      <a-table 
        :scroll="options.scroll"
        size="small"
        :loading="options.loading"
        :columns="columns" 
        :dataSource="list" 
        :pagination="false"
      > 
        <span slot="name" slot-scope="name">
          <span
            :style="{
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             whiteSpace: 'nowrap',
             display: 'inline-block',
             width: '200px'
             }"
          >{{name}}</span>
        </span>
        <template
          v-for="col in editFields"
          :slot="col"
          slot-scope="text, record"
        >
          <div :key="col">
            <a-input
              v-if="record.editable"
              style="margin: -5px 0"
              :value="text"
              @change="e => operates[0].method(e.target.value, record.key, col)"
            />
            <template v-else>{{text}}</template>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <div v-if="options.editShow" class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="() => operates[1].method(record.key)">{{operates[1].name}}</a>
              <a-popconfirm title="Sure to cancel?" @confirm="() => operates[2].method(record.key)">
                <a>{{operates[2].name}}</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="() => operates[3].method(record.key)">{{operates[3].name}}</a>
            </span>
          </div>
          <span v-if="options.detail">
            <a @click="() => operates[4].method()">{{operates[4].name}}</a>
          </span>
        </template>
      </a-table>
    </template>
    <!-- 分页 -->
    <div class="book-page">
      <template>
        <a-pagination
          :pageSizeOptions="paging.pageSizeOptions"
          showSizeChanger
          @showSizeChange="onShowSizeChange"
          showQuickJumper
          :defaultCurrent="1"
          :total="paging.total"
          @change="pageChange"
        />
      </template>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ITable',
  props: {
    list: { // 数据列表
      type: Array
      // default: []
    },
    columns: { // title标题
      type: Array
      // default: []
    },
    editFields: { // 可编辑字段
      type: Array,
      default: () => []
    },
    operates: {
      type: Array
      // default: []
    }, // 操作按钮
    options: { // 表格控制参数
      type: Object
      // default: {}
    },
    paging: { // 分页参数
      type: Object
      // default: {}
    }
  },
  data () {
    return {

    }
  },
  methods: {

    pageChange (current) {
      this.$emit('pageChange', current)
    },

    onShowSizeChange (current, pageSize) {
      this.$emit('showSizeChange', pageSize)
    }
  }
}
</script>

<style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
  .book-page {
    padding: 40px 0;
    display: flex;
    justify-content: center;
  }
</style>
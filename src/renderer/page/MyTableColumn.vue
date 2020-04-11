<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable table</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <draggable v-model="headers" tag="tr">
            <th v-for="header in headers" :key="header" scope="col">{{ header }}</th>
          </draggable>
        </thead>
        <draggable v-model="list" tag="tbody">
          <tr v-for="(item,index) in list" :key="index">
            <td 
              scope="row" 
              v-for="(header,i) in headers" 
              :key="i"
              @dblclick="editText($event,list, index, i)"
            >
                <input
                  v-if="showInputRow === index && showInputCol === i"
                  type="text"
                  @blur="inputStred(list, index, header)"
                  v-model="text"
                />
                <span v-else>{{ item[header] }}</span>
                <!-- <span>{{header}}</span> -->
            </td>
          </tr>
        </draggable>
      </table>
    </div>

  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "table-column-example",
  display: "Table Column",
  order: 9,
  data() {
    return {
      showInputRow: "", //单元格横坐标
      showInputCol: "", //单元格纵坐标
      showInputHead: "", //显示隐藏输入框
      text: "", //输入框编辑内容
      edit: false,
      headers: ["id", "name", "sport"],
      list: [
        { id: 1, name: "Abby", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
      dragging: false
    };
  },
  components: {
    draggable
  },
  methods: {
    // 双击编辑
    editText(e, data, indexRow, indexCol) {
    //   console.log(indexCol)
      this.text = e.target.innerText;
      if (data === this.list) {
        this.showInputCol = indexCol;
        this.showInputRow = indexRow;
      } else this.showInputHead = indexRow;
    },
    // 失焦-取消编辑
    inputStred(data, indexRow, key) {
      data == this.list
        ? (data[indexRow][`${key}`] = this.text)
        : (data[indexRow] = this.text);
      this.showInputRow = "";
      this.showInputCol = "";
      this.showInputHead = "";
      this.text = "";
    }
  }
};
</script>
<style lang="less" scoped>
.row {
  display: flex;
  justify-content: center;
  th {
    padding-left: 10px;
    width: 200px;
    height: 50px;
    color: white;
    background-color: rgb(37, 34, 34);
  }
  td {
    height: 40px;
    position: relative;
    padding-left: 10px;
    .t_input {
      position: absolute;
    }
  }
}
.buttons {
  margin-top: 35px;
}
</style>
<template>
  <div class="row">
    <div class="col-8">
      <h3>Draggable table</h3>

      <table class="table table-striped">
        <thead class="thead-dark">
          <draggable v-model="headers" tag="tr">
            <th v-for="header in headers" :key="header" scope="col">{{ header }}</th>
            <th>
              <a-button @click="delCol">删除列</a-button>
              <a-button @click="addCol">新增列</a-button>
            </th>
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
              <!-- 文本输入框 -->
              <div v-if="hideTexts">
                <input
                v-if="showInputRow === index && showInputCol === i"
                type="text"
                @blur="inputStred(list, index, header)"
                v-model="text"
              />
                <span v-else>{{ item[header] }}</span>
              </div>
              <!-- 日期选择器 -->
              <div v-if="hideDate">
                <a-date-picker @change="onChange" @blur="inputStred(list, index, header)"  v-if="showInputRow === index && showInputCol === i"/>
                <span v-else>{{ item[header] }}</span>
              </div>
              <span v-if="contentValue">{{ item[header] }}</span>
              <!-- <span>{{index}}</span> -->
            </td>
            <td>
              <a-button @click="delRow(index)">删除</a-button>
              <a-button @click="addRow(index)">添加</a-button>
            </td>
          </tr>
        </draggable>
      </table>
      <div style="marginTop: 30px">
        <a-button @click="textBtn">文本</a-button>
        <a-button @click="dateBtn">日期</a-button>
      </div>
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
      headers: ["id", "name", "sport"],
      list: [
        { id: 1, name: "jason", sport: "basket" },
        { id: 2, name: "Brooke", sport: "foot" },
        { id: 3, name: "Courtenay", sport: "volley" },
        { id: 4, name: "David", sport: "rugby" }
      ],
      //tableBody对象key值数组
      keyBody: ["body1", "body2", "body3"],
      // 初始表格行
      bodyRow: {
        body1: "",
        body2: "",
        body3: ""
      },
      hideTexts: false,
      hideDate: false,
      contentValue: true,
      dragging: false
    };
  },
  components: {
    draggable
  },
  methods: {
    //选择日期
    onChange(date, dateString) {
      this.text = dateString;
      // console.log(date, dateString);
    },
    textBtn() {
      this.hideTexts = true; //文本框显示
      this.hideDate = ""; //日期选择隐藏
      this.contentValue = false; //表格内容显示
    },
    dateBtn() {
      this.hideDate = true; //日期选择显示
      this.hideTexts = ""; //文本框隐藏
      this.contentValue = false; //表格内容显示
    },
    // 双击编辑
    editText(e, data, indexRow, indexCol) {
      this.text = e.target.innerText;
      if (data === this.list) {
        this.showInputCol = indexCol;
        this.showInputRow = indexRow;
      }
      console.log(`showInputRow:${this.showInputRow}showInputCol:${this.showInputCol}`);
    },
    // 失焦-取消编辑
    inputStred(data, indexRow, key) {
      data == this.list
        ? (data[indexRow][`${key}`] = this.text)
        : (data[indexRow] = this.text);
      this.showInputRow = "";
      this.showInputCol = "";
      // this.showInputHead = "";
      this.text = "";
    },
    // 添加行
    addRow(index) {
      this.list.splice(index + 1, 0, JSON.parse(JSON.stringify(this.bodyRow)));
    },
    // 删除行
    delRow(index) {
      this.list.splice(index, 1);
    },
    // 添加列
    addCol(length) {
      let key = "body" + length;
      this.keyBody.push(key);
      this.headers.splice(length, 0, "");
      this.list.forEach((item, index) => {
        this.list[index] = {
          ...this.list[index],
          [key]: ""
        };
      });
      this.bodyRow = { ...this.bodyRow, [key]: "" };
    },
    // 删除列
    delCol() {
      let length = this.headers.length;
      let keyBodyLength = this.keyBody.length - 1;
      this.headers.splice(length - 1, 1);
      this.list.forEach((item, index) => {
        delete item[this.keyBody[keyBodyLength]];
      });
      this.keyBody.pop();
    }
  }
};
</script>
<style lang="less" scoped>
.row {
  display: flex;
  justify-content: center;
  th {
    border: 1px solid black;
    padding-left: 10px;
    width: 200px;
    height: 50px;
    color: white;
    background-color: rgb(37, 34, 34);
  }
  td {
    border: 1px solid black;
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
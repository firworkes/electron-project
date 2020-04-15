<template>
  <div id="app" style="display: flex; align-items: center; justify-content: center">
    <div id="map"></div>
  </div>
</template>

<script>
import MindElixir, { E } from "mind-elixir";
export default {
  mounted() {
    let mind = new MindElixir({
      el: "#map",
      direction: MindElixir.LEFT,
      // 创建新数据
      data: MindElixir.new("new topic"),
      // 也使用 getDataAll 得到的数据
      // data: {...},
      draggable: true, // 启用拖动 default true
      contextMenu: true, // 启用右键菜单 default true
      toolBar: true, // 启用工具栏 default true
      nodeMenu: true, // 启用节点菜单 default true
      keypress: true // 启用快捷键 default true
    });
    mind.init();

    // get a node
    E("node-id");
  }
};
</script>

<style>
.outer {
  position: relative;
  margin: 50px;
}
#map {
  height: 500px;
  width: 100%;
  overflow: auto;
}
</style>
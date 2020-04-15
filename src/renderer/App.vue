<template>
  <div id="app">
    <ul class="nav">
      <li>
        <router-link to="/">Draggable</router-link>
      </li>
      <li>
        <router-link to="/MyTable">EditMyTable</router-link>
      </li>
      <li>
        <router-link to="/mytablecolumn">MyTableColumn</router-link>
      </li>
      <li>
        <router-link to="/table">table</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'my-project'
  }
</script>

<style lang="less" scoped>
 .nav {
  border: 1px solid black;
  justify-content: center;
  display: flex;
  list-style: none;
  li {
    margin: 30px;
  }
}
</style>

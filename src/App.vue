<template>
  <router-view></router-view>
</template>

<script>
import { compiler } from "./views/babel-parse/parse.js";
export default {
  name: "App",
  components: {
  },
  created() {
    const output = compiler("const add = (a, b) => a + b");
    console.log(output);
  },
  mounted() {
    // const menu = document.getElementById('#menu')
    // menu.onclick = function () {
    //   let customEvent = new CustomEvent("menu-open", {
    //     bubbles: true
    //   })
    //   setTimeout(() => {
    //     menu.dispatchEvent(customEvent)
    //     console.log('custom event---')
    //   })
    // }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

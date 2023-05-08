<template>
  <button id="menu">Menu (click me)</button>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import { compiler } from "./pages/babel-parse/parse.js";
export default {
  name: "App",
  components: {
    HelloWorld,
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

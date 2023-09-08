<template>
  <div id="app">
    <b-container>
      <b-row>
        <HeaderComponent></HeaderComponent>
      </b-row>
    </b-container>
    <router-view></router-view>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderComponent from '@/components/HeaderComponent.vue';

export default {
  components: {
    HeaderComponent
  },
  methods: {
    created() {
      // Setting Language in the HTML document
      document.documentElement.setAttribute('lang', 'it');
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  margin: 0;
  max-width: initial;
}

.black {
  background-color: transparent;
  color: black;
  border-color: transparent;
  max-width: 50px;
}

.black:active, .black:focus, .black:hover, .black:focus-visible {
  background-color: transparent !important;
  color: black !important;
  border-color: transparent !important;
}
</style>

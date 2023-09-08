<template>
  <b-container>
    <b-row>
      <b-button class="black" v-b-toggle.sidebar-backdrop>
        <b-icon-list></b-icon-list>
      </b-button>
      <img src="../assets/Animal_house_game.svg" alt="">
      <b-dropdown id="userProfileDropdown" class="m-2 colors" no-caret right>
        <template #button-content>
          <b-icon-person></b-icon-person>
        </template>
        <b-dropdown-text style="width: 240px;">
          <div v-if="!logged">Fai il login per salvare i tuoi punteggi e i tuoi animali</div>
          <div v-else>Loggato come {{ username }}</div>
        </b-dropdown-text>
        <b-dropdown-divider></b-dropdown-divider>
        <b-dropdown-item v-if="!logged" href="/frontoffice" target="_blank">Login
          <b-icon-box-arrow-up-right style="color: #008c69; width: 0.6em;"></b-icon-box-arrow-up-right>
        </b-dropdown-item>
        <b-dropdown-item-button v-else @click="logout()">Logout
          <b-icon-power style="color: red;width: 0.6em;"></b-icon-power>
        </b-dropdown-item-button>
      </b-dropdown>
    </b-row>
    <MenuComponent></MenuComponent>
  </b-container>
</template>

<script>
import MenuComponent from './MenuComponent.vue';

const apiURL = "/api/v1/";

export default {
  name: 'HeaderComponent',
  components: {
    MenuComponent
  },
  data() {
    return {
      logged: false,
      username: "",
      disableReload: false,
    };
  },
  created() {
    fetch(apiURL + "auth", {
      method: "GET",
      credentials: "same-origin",
    }).then(res => res.json()).
    then(data => {
      this.username = data.username;
      this.logged = true;
    }).catch(err => {
      console.error(err);
      this.username = "";
      this.logged = false;
    });
  },
  methods: {
    logout() {
      fetch(apiURL + "auth", {
        method: "DELETE",
        credentials: "same-origin",
      }).catch(result => {
        console.error(result);
      }).finally(() => {
        this.username = "";
        this.logged = false;
        if (!this.disableReload) {
          window.location.reload();
        }
      });
    },
  }
};
</script>

<style scoped>
.container {
  background-color: #008c69;
  margin: 0;
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;
}

.row {
  margin: 0;
  padding: 1rem 0;
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 2rem;
  justify-content: space-between;
}

img {
  height: 3em;
}
</style>

<style>
#userProfileDropdown > button, #userProfileDropdown > button:hover, #userProfileDropdown > button:active, #userProfileDropdown > button:focus {
  color: black !important;
  background-color: transparent !important;
  border-color: transparent !important;
}
</style>

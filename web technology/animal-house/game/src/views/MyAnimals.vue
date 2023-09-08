<template>
  <SpinnerComponent v-if="!loaded"></SpinnerComponent>
  <b-container v-else>
    <b-row class="center">
      <div class="box">
        <div>
          <b-card title="Aggiungi animali">
            <b-card-text>
              Aggiungi tutti i tuoi animali per farci capire quali prodotti e servizi fanno al caso tuo.
            </b-card-text>
            <b-link class="card-link" href="/frontoffice" target="_blank" v-if="logged">Aggiungi un animale
              <b-icon-box-arrow-up-right style="color: #008c69; width: 0.6em;"></b-icon-box-arrow-up-right>
            </b-link>
            <b-link class="card-link" :to="{name: 'new-animal'}" v-else>Aggiungi un animale</b-link>
          </b-card>
        </div>
        <div v-if="animals !== null && animals !== {}">
          <div v-for="(animal, name) in animals">
            <b-card :title="name">
              <b-card-text>
                Specie: {{ animal?.type }}<br>
                Età: {{ animal?.age }}<br>
                Genere: {{ animal?.gender }}<br>
              </b-card-text>
              <b-card-text>
                {{ animal?.description }}
              </b-card-text>
            </b-card>
          </div>
        </div>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import SpinnerComponent from "@/components/SpinnerComponent.vue";

const apiURL = "/api/v1/";

export default {
  name: 'MyAnimalsView',
  components: { SpinnerComponent },
  data() {
    return {
      loaded: false,
      logged: false,
      animals: {},
    };
  },
  mounted() {
    this.animals = JSON.parse(localStorage.animal ?? "{}");
  },
  created() {
    fetch(apiURL + "auth", {
      method: "GET",
      credentials: "same-origin",
    }).then(response => response.json()).
    then(data => {
      fetch(apiURL + `users/${data.username}/animals`, {
        method: "GET",
        credentials: "same-origin",
      }).then(response => response.json()).
      then(animals => {
        this.animals = animals;
        this.logged = true;
      }).finally(() => {
        this.loaded = true;
      });
    }).catch(_ => {
      this.loaded = true;
    });
  },
};
</script>

<style scoped>
a {
  color: #008c69;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
  padding: 0.5rem;
  border-radius: 20px;
}

a:active, a:hover, a:focus, a:focus-visible {
  color: #008c69;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
  padding: 0.5rem;
  border-radius: 20px;
}

.box {
  margin: 1rem;
}

.card {
  margin-bottom: 1rem;
}

.center {
  justify-content: center;
}
</style>

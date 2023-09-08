<template>
  <b-container>
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <b-row class="mb-4 justify-content-between" v-else>
      <div class="col-12 col-md-4 mb-5 text-center" v-if="logged">
        <p class="h3 mb-4">I tuoi punteggi</p>
        <p>Punteggio precedente: {{ lastScore }}</p>
        <p>Miglior punteggio: {{ bestScore }}</p>
      </div>
      <div class="col-12 col-md-4 mb-5 text-center" v-else>
        <p class="h3 mb-4">I tuoi punteggi</p>
        <p>Accedi per salvare i tuoi punteggi
          <b-link href="/frontoffice" target="_blank">
            <b-icon-box-arrow-up-right style="color: #008c69;"></b-icon-box-arrow-up-right>
          </b-link>
        </p>
      </div>
      <div class="col-12 col-md-8 justify-content-center text-center">
        <p class="h3 mb-4">Punteggi migliori:</p>
        <b-list-group class="px-4 w-custom">
          <b-list-group-item v-for="(record, index) in records">
            <b-container>
              <b-row>
                <div class="col-2">
                  {{ index + 1 }}
                </div>
                <div class="col" v-if="record == null">
                  <p class="m-0 fw-light text-secondary">Non disponibile</p>
                </div>
                <div class="col box" v-else>
                  <div>
                    {{ record.name }}{{ record.surname === "" ? "" : " " }}{{ record.surname }}
                  </div>
                  <div>
                    {{ record.score }}
                  </div>
                </div>
              </b-row>
            </b-container>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import SpinnerComponent from "@/components/SpinnerComponent.vue";

const apiURL = "/api/v1/";

export default {
  name: 'GameStatsComponent',
  components: {
    SpinnerComponent,
  },
  props: ['gameType'],
  data() {
    return {
      loading: true,
      records: [],
      lastScore: 0,
      bestScore: 0,
      logged: false,
    };
  },
  created() {
    this.updateScores();
  },
  methods: {
    updateScores() {
      let promise1 = fetch(apiURL + `leaderboards/${this.gameType}`, {
        method: 'GET',
        credentials: "same-origin",
      }).then(response => response.json()).
      then(leaderboard => {
        this.records = leaderboard;
        while (this.records.length < 3) {
          this.records.push(null);
        }
      }).catch(err => {
        console.error(err);
        this.records = [null, null, null];
      });

      let promise2 = fetch(apiURL + "auth", {
        method: 'GET',
        credentials: "same-origin",
      }).then(async response => {
        if (response.ok) {
          this.logged = true;
          const data = await response.json();
          await fetch(apiURL + `users/${data.username}/games/${this.gameType}`, {
            method: 'GET',
            credentials: "same-origin",
          }).then(response => {
            if (response.status === 404) {
              return { last: 0, best: 0 };
            }
            return response.json();
          }).
          then(data => {
            this.lastScore = data.last ?? 0;
            this.bestScore = data.best ?? 0;
          }).catch(err => {
            console.error(err);
            this.lastScore = 0;
            this.bestScore = 0;
          });
        } else {
          this.logged = false;
        }
      }).catch(err => {
        console.error(err);
        this.logged = false;
        this.lastScore = 0;
        this.bestScore = 0;
      });

      Promise.all([promise1, promise2]).finally(() => {
        this.loading = false;
      });
    },
  }
};
</script>

<style scoped>
.box {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.list-group {
  margin: 0 auto;
}

@media (min-width: 768px) {
  .w-custom {
    width: 50vw;
  }
}

@media (min-width: 1200px) {
  .w-custom {
    width: 40vw;
  }
}
</style>

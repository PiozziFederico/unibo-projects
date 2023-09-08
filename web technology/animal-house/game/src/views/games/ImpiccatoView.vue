<template>
  <b-container>
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <div v-else-if="!started && firstRun">
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="firstRun = false; started = true; start()">Gioca</b-button>
      </div>
      <GameStatsComponent game-type="impiccato"></GameStatsComponent>
    </div>
    <div v-else-if="!started">
      <b-row class="justify-content-between mt-5">
        <div class="col-12 col-md-6">
          <div class="h3">La parola era:</div>
          <br>
          <span style="letter-spacing: 3px;">{{ toGuess }}</span>
        </div>
        <div class="col-12 col-md-6 mt-2 mt-md-0">
          <img class="tentativi" src="../../assets/10.png" alt=""></img>
        </div>
      </b-row>
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="started = true; start()">Gioca ancora</b-button>
      </div>
      <PostGameStatsComponent game-type="impiccato" :points="round - 1"></PostGameStatsComponent>
    </div>
    <b-row class="mt-4" v-else>
      <!-- Game started -->
      <div class="col-12 col-md-6 mb-2">
        <div class="h3">Parola da indovinare:</div>
        <br>
        <span style="letter-spacing: 3px;">{{ toRender }}</span>
      </div>
      <div class="col-12 col-md-6 mt-3 mt-md-0">
        <div class="h3">Tentativi rimanenti:</div>
        <br>
        <img class="tentativi" src="../../assets/0.png" v-show="lives == 10" :alt="lives"></img>
        <img class="tentativi" src="../../assets/1.png" v-show="lives == 9" :alt="lives"></img>
        <img class="tentativi" src="../../assets/2.png" v-show="lives == 8" :alt="lives"></img>
        <img class="tentativi" src="../../assets/3.png" v-show="lives == 7" :alt="lives"></img>
        <img class="tentativi" src="../../assets/4.png" v-show="lives == 6" :alt="lives"></img>
        <img class="tentativi" src="../../assets/5.png" v-show="lives == 5" :alt="lives"></img>
        <img class="tentativi" src="../../assets/6.png" v-show="lives == 4" :alt="lives"></img>
        <img class="tentativi" src="../../assets/7.png" v-show="lives == 3" :alt="lives"></img>
        <img class="tentativi" src="../../assets/8.png" v-show="lives == 2" :alt="lives"></img>
        <img class="tentativi" src="../../assets/9.png" v-show="lives == 1" :alt="lives"></img>
      </div>
      <div class="col-12 mt-5">
        <Alphanav :alphaList="alphabet" @selected="guess" ref="alphaList"></Alphanav>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import GameStatsComponent from "@/components/GameStatsComponent.vue";
import PostGameStatsComponent from "@/components/PostGameStatsComponent.vue";
import Alphanav from 'vue-alphanav';

const vowels = ['a', 'e', 'i', 'o', 'u', 'y'];

export default {
  name: 'ImpiccatoView',
  components: {
    PostGameStatsComponent,
    GameStatsComponent,
    SpinnerComponent,
    Alphanav,
  },
  data() {
    return {
      firstRun: true,
      loading: false,
      started: false,
      round: 0,
      lives: 10,
      alphabet: [],
      guessed: [],
      toGuess: "",
      toRender: "",
    };
  },
  methods: {
    start() {
      this.round = 0;
      this.nextRound();
    },
    nextRound() {
      this.round++;
      this.loading = true;
      this.lives = 10;
      this.alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");
      this.guessed = [];

      fetch(`https://random-word-form.herokuapp.com/random/animal`).
        then(response => response.json()).
        then(data => data[0]).
        then(word => {
          this.toGuess = word;
          this.toRender = this.replaceChars();
          this.loading = false;
        }).catch(err => {
          console.error(err);
          this.reset();
        });
    },
    guess(alphaValue) {
      const letter = alphaValue.value;
      this.$refs.alphaList.unselect();
      if (this.guessed.includes(letter)) {
        console.error("guessed already includes letter " + letter);
        return;
      }
      if (this.toGuess.indexOf(letter) === -1) {
        this.lives--;
        if (this.lives === 0) {
          this.reset();
          return;
        }
      }
      this.guessed.push(letter);
      this.alphabet = this.alphabet.filter(char => char !== letter);
      this.toRender = this.replaceChars();
      if (this.toRender === this.toGuess) {
        this.nextRound();
      }
    },
    reset() {
      this.started = false;
      this.loading = false;
    },
    replaceChars() {
      let chars = Array.from(this.toGuess);
      for (let i = 0; i < chars.length; i++) {
        if (!this.guessed.includes(chars[i])) {
          chars[i] = vowels.includes(chars[i]) ? '+' : '-';
        }
      }
      return chars.join("");
    },
  }
};
</script>

<style scoped>
.btn-start {
  background-color: #008c69;
  border-radius: 50px;
  width: 30%;
  text-transform: uppercase;
}

img.tentativi {
  min-width: 6rem;
  width: 8vw;
  border: solid 1px black;
}
</style>
<style>
.alphanav {
  background-color: transparent !important;
  flex-wrap: wrap !important;
}

.alphanav li a {
  color: #008c69;
  font-size: 30px;
  margin-right: 2rem !important;
  padding: 7px 14px !important;
}

.alphanav li a:hover {
  text-decoration: none !important;
  background-color: #008c69 !important;
}
</style>

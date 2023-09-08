<template>
  <b-container>
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <div v-else-if="!started && firstRun">
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="firstRun = false;started = true;start()">Gioca</b-button>
      </div>
      <GameStatsComponent game-type="memory"></GameStatsComponent>
    </div>
    <div v-else-if="!started">
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="started = true;start()">Gioca ancora</b-button>
      </div>
      <PostGameStatsComponent game-type="memory" :points="round - 1"></PostGameStatsComponent>
    </div>
    <div v-else>
      <b-row class="justify-content-center">
        <b-col cols="12">
          <p class="h3 mb-4 mt-2">Errori rimanenti: {{ lives }}</p>
        </b-col>
      </b-row>
      <b-container class="container-custom">
        <b-row class="justify-content-center align-items-center row-custom">
          <!-- Game started -->
          <b-col cols="3" class="mb-4 p-0" v-for="(image, index) in images" :key="rerender">
            <MemoryCardComponent :src="image" :alt="alts[index]" :number="index" :disabled="disabled" :guessed="toShow.has(index)"
                                :hidden="!toShow.has(index)" :selected="selected === index" @click="answer(index)"></MemoryCardComponent>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </b-container>
</template>

<script>
import { shuffle } from 'array-permutation';
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import GameStatsComponent from "@/components/GameStatsComponent.vue";
import PostGameStatsComponent from "@/components/PostGameStatsComponent.vue";
import MemoryCardComponent from "@/components/MemoryCardComponent.vue";

const APIS = [
  "https://some-random-api.ml/animal/koala",
  "https://some-random-api.ml/animal/kangaroo",
  "https://some-random-api.ml/animal/fox",
  "https://some-random-api.ml/animal/dog",
  "https://some-random-api.ml/animal/cat",
  "https://some-random-api.ml/animal/bird",
  "https://some-random-api.ml/animal/red_panda",
  "https://some-random-api.ml/animal/panda",
];

const IMAGE_NUMBER = 8;
const LIVES = 10;

export default {
  name: 'MemoryView',
  components: {
    MemoryCardComponent,
    PostGameStatsComponent,
    GameStatsComponent,
    SpinnerComponent,
  },
  data() {
    return {
      rerender: 0,
      firstRun: true,
      loading: false,
      started: false,
      disabled: false,
      round: 0,
      lives: LIVES,
      remaining: IMAGE_NUMBER,
      selected: null,
      images: [],
      alts: [],
      toShow: new Set(),
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
      this.toShow = new Set();
      this.lives = LIVES;
      this.selected = null;
      let promises = [];
      let alts = {};
      let set = new Set();

      for (let i = 0; i < IMAGE_NUMBER; i++) {
        promises.push(Promise.resolve().then(async _ => {
          while (true) {
            let [image, alt] = await fetch(this.getRandomFromArray(APIS)).
            then(response => response.json()).
            then(data => [data.image, data.fact]).
            catch(err => {
              console.error(err);
              return [null, null];
            });
            if (image == null) {
              // Error happened, return
              return;
            }
            if (!set.has(image)) {
              set.add(image);
              alts[image] = alt;
              break;
            }
          }
        }));
      }

      Promise.all(promises).finally(() => {
        this.remaining = set.size;
        this.images = [...set];
        this.images.push(...set);
        this.images = shuffle(this.images);
        this.alts = this.images.map(image => alts[image]);
        this.loading = false;
      });
    },
    answer(image_num) {
      this.toShow.add(image_num);

      if (this.selected == null) {
        this.selected = image_num;
        this.rerender++;
        return;
      }

      if (this.images[this.selected] === this.images[image_num]) {
        // Matching
        this.selected = null;
        this.remaining--;
        if (this.remaining === 0) {
          this.nextRound();
        }
      } else {
        // Not matching
        this.lives--;
        if (this.lives === 0) {
          this.reset();
          return;
        }

        this.disabled = true;
        this.rerender++;
        setTimeout(() => {
          this.toShow.delete(this.selected);
          this.toShow.delete(image_num);
          this.selected = null;
          this.disabled = false;
          this.rerender++;
        }, 1000);
      }
    },
    reset() {
      this.started = false;
      this.loading = false;
    },
    // https://stackoverflow.com/a/1527820
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandomFromArray(array) {
      return array[this.getRandomInt(0, array.length - 1)];
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
@media (min-width: 768px) {
  .container-custom {
    width: 70vw;
    margin: 0 auto;
  }
  .row-custom {
    margin: 0 auto;
  }
}
</style>

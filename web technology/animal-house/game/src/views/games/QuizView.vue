<template>
  <b-container>
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <div v-else-if="!started && firstRun">
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="firstRun = false;started = true;start()">Gioca</b-button>
      </div>
      <hr>
      <GameStatsComponent class="mt-5" game-type="quiz"></GameStatsComponent>
    </div>
    <div v-else-if="!started">
      <div class="container text-center my-5">
        <!-- Game not started yer-->
        <b-button class="btn-start" @click="started = true;start()">Gioca ancora</b-button>
      </div>
      <PostGameStatsComponent game-type="quiz" :points="round - 1"></PostGameStatsComponent>
    </div>
    <b-row v-else>
      <!-- Game started -->
      <div class="col-12 h3 mb-5 mt-4" v-html="question"></div>
      <div class="col-12 col-sm-6 mb-1">
        <b-button class="btn-end" @click="answer(0)" v-html="answers[display_order[0]]"></b-button>
      </div>
      <div class="col-12 col-sm-6 mb-1">
        <b-button class="btn-end" @click="answer(1)" v-html="answers[display_order[1]]"></b-button>
      </div>
      <div class="col-12 col-sm-6 mb-1">
        <b-button class="btn-end" @click="answer(2)" v-html="answers[display_order[2]]"></b-button>
      </div>
      <div class="col-12 col-sm-6 mb-1">
        <b-button class="btn-end" @click="answer(3)" v-html="answers[display_order[3]]"></b-button>
      </div>
    </b-row>
  </b-container>
</template>

<script>
import { random } from 'array-permutation';
import SpinnerComponent from "@/components/SpinnerComponent.vue";
import GameStatsComponent from "@/components/GameStatsComponent.vue";
import PostGameStatsComponent from "@/components/PostGameStatsComponent.vue";

const difficulties = [
  "easy",
  "medium",
  "hard",
];

export default {
  name: 'QuizView',
  components: {
    PostGameStatsComponent,
    GameStatsComponent,
    SpinnerComponent,
  },
  data() {
    return {
      firstRun: true,
      loading: false,
      started: false,
      round: 0,
      question: "",
      answers: [], // answers[0] is the correct one
      display_order: [],
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
      let difficulty;
      if (this.round < 5) {
        difficulty = difficulties[0];
      } else if (this.round < 11) {
        difficulty = difficulties[1];
      } else {
        difficulty = difficulties[2];
      }
      fetch(`https://opentdb.com/api.php?amount=1&category=27&difficulty=${difficulty}&type=multiple`).
      then(response => response.json()).then(data => data.results).
      then(data => {
        this.question = data[0].question;
        this.answers = [];
        this.answers.push(data[0].correct_answer ?? "");
        for (let ina of data[0].incorrect_answers) {
          this.answers.push(ina);
        }
        this.display_order = random(this.answers.length);
        this.loading = false;
      }).catch(err => {
        console.error(err);
        this.reset();
      });
    },
    answer(answer_num) {
      if (this.display_order[answer_num] === 0) {
        // Correct answer
        this.nextRound();
      } else {
        // Wrong answer
        this.reset();
      }
    },
    reset() {
      this.started = false;
      this.loading = false;
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

.btn-end {
  background-color: white !important;
  border: 1px solid #008c69 !important;
  min-width: 30%;
  color: #008c69;
  font-weight: 600;
  padding: 0.5rem;
  border-radius: 25px;
}
</style>

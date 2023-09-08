<template>
  <b-container>
    <SpinnerComponent v-if="!loaded"></SpinnerComponent>
    <div v-else>
      <b-row class="justify-content-center">
        <div class="box">
          <div>
            <b-card title="Curiosità">
              <b-card-text>
                <p>
                  Ecco delle curiosità riguardanti gli animali.
                </p>
                <b-button id="curiosityButton" @click="loadCuriosity()">Nuove curiosità</b-button>
              </b-card-text>
            </b-card>
          </div>
        </div>
      </b-row>
      <b-row class="justify-content-center align-items-start row-cols-1 row-cols-lg-2">
        <b-col class="justify-content-center align-items-start mb-3">
          <b-card
              :img-src="image"
              img-alt=""
              img-top
              style="max-width: 20rem; margin: 0 auto;"
              class="mb-2"
          >
            <b-card-text>
              {{ fact }}
            </b-card-text>
          </b-card>
        </b-col>
        <b-col class="justify-content-center align-items-start mb-3">
          <b-card
              :img-src="randomImage"
              img-alt=""
              img-top
              style="max-width: 20rem; margin: 0 auto;"
              class="mb-2"
          >
            <b-card-text>
              {{ randomFact }}
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import SpinnerComponent from "@/components/SpinnerComponent.vue";

const API_MAP = {
  "koala": "https://some-random-api.ml/animal/koala",
  "kangaroo": "https://some-random-api.ml/animal/kangaroo",
  "canguro": "https://some-random-api.ml/animal/kangaroo",
  "fox": "https://some-random-api.ml/animal/fox",
  "volpe": "https://some-random-api.ml/animal/fox",
  "dog": "https://some-random-api.ml/animal/dog",
  "cane": "https://some-random-api.ml/animal/dog",
  "cagna": "https://some-random-api.ml/animal/dog",
  "cat": "https://some-random-api.ml/animal/cat",
  "gatto": "https://some-random-api.ml/animal/cat",
  "gatta": "https://some-random-api.ml/animal/cat",
  "bird": "https://some-random-api.ml/animal/bird",
  "uccello": "https://some-random-api.ml/animal/bird",
  "red panda": "https://some-random-api.ml/animal/red_panda",
  "panda rosso": "https://some-random-api.ml/animal/red_panda",
  "panda": "https://some-random-api.ml/animal/panda",
};

const ANIMAL_TYPES = Object.keys(API_MAP);

const apiURL = "/api/v1/";

export default {
  name: 'CuriosityView',
  components: { SpinnerComponent },
  data() {
    return {
      image: null,
      fact: null,
      randomImage: null,
      randomFact: null,
      animals: {},
      logged: false,
      loaded: false,
    };
  },
  created() {
    this.loadAnimals().then(animals => {
      this.animals = animals;
    }).finally(() => {
      this.loadCuriosity();
    });
  },
  methods: {
    loadCuriosity() {
      this.loaded = false;
      let chosen;
      let myAnimals = Object.keys(this.animals);
      if (myAnimals.length === 0 || !ANIMAL_TYPES.includes(chosen = this.getRandomFromArray(myAnimals))) {
        chosen = this.getRandomFromArray(ANIMAL_TYPES);
      }

      let promise1 = fetch(API_MAP[chosen]).
      then(response => response.json()).
      then(data => {
        this.image = data.image;
        this.fact = data.fact;
      }).catch(err => {
        console.error(err);
        this.image = null;
        this.fact = null;
      });

      let promise2 = fetch(API_MAP[this.getRandomFromArray(ANIMAL_TYPES)]).
      then(response => response.json()).
      then(data => {
        this.randomImage = data.image;
        this.randomFact = data.fact;
      }).catch(err => {
        console.error(err);
        this.randomImage = null;
        this.randomFact = null;
      });

      Promise.all([promise1, promise2]).finally(() => {
        this.loaded = true;
      });
    },
    // Returns the type of user's animals
    loadAnimals() {
      return fetch(apiURL + "auth", {
        method: "GET",
        credentials: "same-origin",
      }).
      then(response => response.json()).
      then(data => fetch(apiURL + `users/${data.username}/animals`, {
        method: "GET",
        credentials: "same-origin",
      })).
      then(response => response.json()).
      catch(err => {
        console.error(err);
        return JSON.parse(localStorage.animals ?? "{}");
      }).
      then(animals => {
        let types = [];
        try {
          for (let animal in animals) {
            types.push(animals[animal].type.toLowerCase());
          }
        } catch (err) {
          console.error(err);
          return [];
        }
        return types;
      });
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
#curiosityButton {
  color: #008c69;
  background-color: transparent !important;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
  padding: 0.5rem;
  border-radius: 20px;
}

#curiosityButton:active, #curiosityButton:hover, #curiosityButton:focus, #curiosityButton:focus-visible {
  color: #008c69;
  background-color: transparent !important;
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
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
}
</style>

<template>
  <b-container>
    <b-row>
      <b-col class="col-12 text-center align-content-center">
        <h3>Video buffi</h3>
        <p>Fai una ricerca per ottenere i video più buffi.</p>
      </b-col>
    </b-row>
    <div class="box">
      <b-col class="flex">
        <b-form-input v-model="type" placeholder="Fai una ricerca"></b-form-input>
        <b-button class="btn-search" :disabled="type == ''" @click="search()"><b-icon-search></b-icon-search></b-button>
      </b-col>
    </div>
    <SpinnerComponent v-if="loading"></SpinnerComponent>
    <div v-else id="containerIframe" class="grid">
      <div v-for="video of videos" class="container-iframe">
        <iframe :src="'https://www.youtube-nocookie.com/embed/' + video"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen></iframe>
      </div>
    </div>
  </b-container>
</template>

<script>
import SpinnerComponent from '@/components/SpinnerComponent.vue';
const apiURL = "/api/v1/youtubeSearch/";

export default {
  name: 'NewAnimal',
  components: {
    SpinnerComponent
  },
  data() {
    return {
      loading: false,
      videos: [],
      type: ''
    };
  },
  methods: {
    search() {
      this.loading = true;
      fetch(apiURL + this.type, {
        method: "GET"
      }).then(response => response.json()).then(data => {
        this.videos = data;
        this.loading = false;
      }).catch(error => {
        console.error("Error:", error);
      });
    }
  }
};
</script>

<style scoped>
h3 {
  text-transform: uppercase;
  margin: 1rem 0;
}
#containerIframe {
  margin: 2rem auto;
}
.grid {
  display: grid;
  grid-template-columns: auto;
  grid-gap: 2rem;
}
.container-iframe {
  padding: 0px;
}

iframe {
  width: 100%;
  min-height: 15rem;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-search {
  margin-left: 1rem;
  background-color: #008c69;
}
.box {
  width: 80%;
  align-items: center;
  margin: 0 auto;
}
@media (min-width: 750px) {
  .grid {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 2rem;
  }
}
@media (min-width: 1000px) {
  .grid {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 2rem;
  }
}
</style>

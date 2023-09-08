<template>
  <b-container>
    <div class="box text-center">
      <h2>Animal House e i suoi servizi</h2>
      <div class="row row-cols-1 row-cols-lg-3">
        <div class="col">
          <b-card @click="goToPage('quiz')" id="card1">
            <b-card-body class="text-center" :to="{name: 'quiz'}">
              <div class="d-flex justify-content-center align-item-center">
                <span class="style-span">QUIZ</span>
              </div>
            </b-card-body>
          </b-card>
        </div>
        <div class="col">
          <b-card @click="goToPage('memory')" id="card2">
            <b-card-body class="text-center">
              <div class="d-flex justify-content-center align-item-center">
                <span class="style-span">MEMORY</span>
              </div>
            </b-card-body>
          </b-card>
        </div>
        <div class="col">
          <b-card @click="goToPage('impiccato')" id="card3">
            <b-card-body class="text-center">
              <div class="d-flex justify-content-center align-item-center">
                <span class="style-span">IMPICCATO</span>
              </div>
            </b-card-body>
          </b-card>
        </div>
      </div>
      <!-- <div>
        <b-card title="Gioca">
          <b-card-text>
            Divertiti con i giochi a tema animale offerti da Animal House: quiz, memory e impiccato!
          </b-card-text>
          <b-card-text>Scegli il tuo gioco preferito e mettiti alla prova.</b-card-text>
          <b-link :to="{name: 'quiz'}" class="card-link">Quiz</b-link>
          <b-link :to="{name: 'memory'}" class="card-link">Memory</b-link>
          <b-link :to="{name: 'impiccato'}" class="card-link">Impiccato</b-link>
        </b-card>
      </div> -->
      <!-- <div>
        <b-card title="I miei animali">
          <b-card-text>
            Aggiungi i tuoi animali per cercare curiosità su di loro.
          </b-card-text>
          <b-link :to="{name: 'my-animals'}" class="card-link">I miei animali</b-link>
          <b-link :to="{name: 'curiosity'}" class="card-link">Curiosità</b-link>
        </b-card>
      </div>
      <div>
        <b-card title="E-commerce e Servizi">
          <b-card-text>
            Animal House offre una vasta gamma di servizi e di prodotti di qualità per ogni tipologia di animale ed esigenza.
            Veterinario, psicologo, dog-sitter, toelettatura, visita a domicilio e tanti altri servizi.
          </b-card-text>
          <b-card-text>Scopri tutti questi prodotti e servizi accedendo al Frontoffice di Animal House</b-card-text>
          <b-link href="https://site212234.tw.cs.unibo.it/frontoffice/" class="card-link">Frontoffice
            <b-icon-box-arrow-up-right style="color: #008c69; width: 0.6em;"></b-icon-box-arrow-up-right>
          </b-link>
        </b-card>
      </div> -->
      <hr>
      <div class="container text-center">
        <p class="h3 mt-4 mb-2">Curiosità</p>
        <p class="fw-light h6 mb-4">Accedi per conoscere curiosità sui tuoi animali</p>
        <b-link :to="{name: 'curiosity'}">Mostra</b-link>
      </div>
      <hr>
      <div class="container text-center">
        <p class="h3 mt-4 mb-2">I Miei Animali</p>
        <p class="fw-light h6 mb-4">Accedi per visualizzare ed aggiungere i tuoi animali</p>
        <b-link :to="{name: 'curiosity'}">Mostra</b-link>
      </div>
    </div>
  </b-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {};
  },
  methods: {
    toNewAnimal() {
      this.$router.push({ path: '/new-animal' });
    },
    goToPage(text) {
      this.$router.push({ path: text });
    }
  }
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

.box {
  margin: 1rem;
}

.card {
  margin-bottom: 1rem;
  box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
  cursor: pointer;
}

.card-title {
  color: #008c69;
  text-transform: uppercase;
  font-weight: 600;
}

.center {
  justify-content: center;
}
.style-span {
  font-weight: 600;
  font-size: 40px;
  letter-spacing: 7px;
}
#card1 {
  background-color: #00b789;
  color: white;
}
#card2 {
  background-color: #57d1cf;
  color: white;
}
#card3 {
  background-color: #629a9e;
  color: white;
}
</style>

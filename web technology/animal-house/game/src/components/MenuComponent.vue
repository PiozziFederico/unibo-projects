<template>
  <div>
    <b-sidebar
        id="sidebar-backdrop"
        backdrop
        shadow>
      <div class="img-container">
        <img src="../assets/Animal_house_game.svg" alt="">
      </div>
      <b-list-group>
        <b-list-group-item :to="{name: 'home'}">Home</b-list-group-item>
        <b-list-group-item href="/frontoffice">Front Office
          <b-icon-box-arrow-up-right style="color: #008c69; width: 0.6em;"></b-icon-box-arrow-up-right>
        </b-list-group-item>
        <b-list-group-item :to="{name: 'quiz'}">Quiz</b-list-group-item>
        <b-list-group-item :to="{name: 'memory'}">Memory</b-list-group-item>
        <b-list-group-item :to="{name: 'impiccato'}">Impiccato</b-list-group-item>
        <b-list-group-item :to="{name: 'my-animals'}">I miei animali</b-list-group-item>
        <b-list-group-item :to="{name: 'curiosity'}">Curiosità</b-list-group-item>
        <b-list-group-item :to="{name: 'video'}">Video</b-list-group-item>
      </b-list-group>
    </b-sidebar>
  </div>
</template>

<script>
export default {
  name: 'MenuComponent',
  components: {},
  methods: {}
};
</script>

<style scoped>
a:active, a, a:focus {
  color: #008c69;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 600;
  background-color: #f8f9fa;
  padding: 1.5rem;
}

.img-container {
  margin: 3rem 1rem;
}

.img-container img {
  width: 100%;
}
</style>

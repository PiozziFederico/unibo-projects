<template>
  <b-container>
    <div class="box">
      <h2 class="text-center">Nuovo Animale</h2>
      <div>
        <b-form @submit="onSubmit" v-if="show" class="text-left">
          <b-form-group id="input-group-1" label="Nome" label-for="input-1">
            <b-form-input
                id="input-1"
                v-model="nome"
                placeholder="Inserisci nome"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="Specie" label-for="input-2">
            <b-form-select
                id="input-2"
                v-model="form.type"
                :options="specie"
                required
                @change="changedSelection"
            ></b-form-select>
          </b-form-group>

          <b-form-group v-if="otherSpecies" id="input-group-3" label="Specifica specie" label-for="input-3">
            <b-form-input
                id="input-3"
                v-model="otherSpecie"
                placeholder="Inserisci specie"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-4" label="Seleziona il sesso" v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="form.gender" :aria-describedby="ariaDescribedby" name="some-radios" value="M">Maschio</b-form-radio>
            <b-form-radio v-model="form.gender" :aria-describedby="ariaDescribedby" name="some-radios" value="F">Femmina</b-form-radio>
          </b-form-group>

          <b-form-group id="input-group-5" label="Età" label-for="input-5">
            <b-form-input
                id="input-5"
                v-model="form.age"
                placeholder="Inserisci età"
                type="number"
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-6" label="Descrizione" label-for="input-6">
            <b-form-textarea
                id="input-6"
                v-model="form.description"
                placeholder="Inserisci eventuali condizioni mediche"
                rows="3"
                max-rows="6"
            ></b-form-textarea>
          </b-form-group>

          <b-button type="submit" class="btn-submit">Aggiungi</b-button>
          <b-button class="text-danger border-danger" @click="cancel()">Cancella</b-button>
        </b-form>
      </div>
    </div>
  </b-container>
</template>

<script>

export default {
  name: 'NewAnimal',
  data() {
    return {
      nome: '',
      form: {
        type: null,
        gender: '',
        age: null,
        description: ''
      },
      specie: ['Cane', 'Gatto', 'Coniglio', 'Criceto', 'Altro'],
      show: true,
      otherSpecies: false,
      otherSpecie: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      if (this.form.type === 'Altro') this.form.type = this.otherSpecie;
      if (!localStorage.animal) {
        localStorage.animal = JSON.stringify({
          [this.nome]: this.form,
        });
      } else {
        let animal = JSON.parse(localStorage.animal);
        animal[this.nome] = this.form;
        localStorage.animal = JSON.stringify(animal);
      }
      this.$router.push({ name: 'my-animals' });
    },
    cancel() {
      this.$router.push({ name: 'my-animals' });
    },
    changedSelection() {
      this.otherSpecies = this.form.type === 'Altro';
    }
  }
};
</script>

<style scoped>
.btn-submit {
  margin-right: 1rem;
}

.btn {
  color: #008c69;
  font-weight: 600;
  text-transform: uppercase;
  border: 1px solid;
  padding: 0.5rem;
  border-radius: 20px;
  background-color: transparent;
}

.btn:active {
  background-color: transparent !important;
}

.btn-submit:active {
  color: #008c69 !important;
}

.box {
  margin: 1rem;
}
</style>

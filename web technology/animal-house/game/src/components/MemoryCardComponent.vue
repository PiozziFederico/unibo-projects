<template>
  <b-button :disabled="disabled || guessed" @click="click()" class="memoryImage">
    <b-img v-show="guessed" fluid-grow :src="src" alt="" :class="selected?'selected':''"></b-img>
    <div v-show="!guessed && hidden" :aria-labelledby="'Immagine nascosta ' + number + '. Clicca per scoprire'"
         :class="selected?'selected':'hiddenMemoryImage'"></div>
    <b-img v-show="!guessed && !hidden" fluid-grow :src="src" :alt="alt" :class="selected?'selected':''"></b-img>
  </b-button>
</template>

<script>
export default {
  name: 'MemoryCardComponent',
  props: ['src', 'alt', 'number', 'hidden', 'disabled', 'guessed', 'selected'],
  emits: ['click'],
  data() {
    return {};
  },
  methods: {
    click() {
      this.$emit('click', {
        number: this.number,
        image: this.src,
        hidden: this.hidden,
        disabled: this.disabled,
      });
    }
  }
};
</script>

<style scoped>
.memoryImage {
  border-style: solid;
  border-color: #006249;
  border-width: 3px;
  border-radius: 5px;
  width: 20vw;
  height: 20vw;
  padding: 0;
  overflow: hidden;
}

.hiddenMemoryImage {
  background-color: #00be8e;
  width: 18rem;
  height: 18rem;
}

img {
  max-width: 18rem;
  max-height: 18rem;
}

.selected {
  opacity: 1 !important;
}
@media (min-width: 768px) {
  .memoryImage {
    border-style: solid;
    border-color: #006249;
    border-width: 3px;
    border-radius: 5px;
    width: 10vw;
    height: 10vw;
    padding: 0;
    overflow: hidden;
  }
}
</style>

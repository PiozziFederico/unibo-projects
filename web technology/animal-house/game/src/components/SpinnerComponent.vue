<template>
    <b-overlay
        id="overlay-background"
        show
        :variant="variant"
        :opacity="opacity"
        :blur="blur"
        rounded="sm"
        no-wrap
        >
        <b-spinner label="Spinning"></b-spinner>
    </b-overlay>
</template>

<script>
export default {
  name: 'SpinnerComponent',
  data () {
    return {
      variant: 'light',
      opacity: 0.85,
      blur: '2px',
      variants: [
        'transparent',
        'white',
        'light',
        'dark',
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info'
      ],
      blurs: [
        { text: 'None', value: '' },
        '1px',
        '2px',
        '5px',
        '0.5em',
        '1rem'
      ]
    }
  }
}
</script>

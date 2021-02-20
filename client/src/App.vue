<template>
  <v-app>
    <div id="app">
      <h1>App</h1>
      <v-btn color='primary'>Button</v-btn>
      <router-view/>
    </div>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
    }
  }
}
</script>

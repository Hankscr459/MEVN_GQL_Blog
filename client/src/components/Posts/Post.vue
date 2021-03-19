<template>
  <v-container>
    <h1>Post {{postId}}</h1>
  </v-container>
</template>

<script>
export default {
  name: 'Post',
  props: ['postId']
}
</script>

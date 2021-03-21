<template>
  <v-container class="text-xs-center">
    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-card-media height="125px" contain :src="user.avatar"></v-card-media>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>Joined {{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-regular">{{user.favorites.length}} Favorites</div>
                <div class="hidden-xs-only font-weight-regular">2 Posts Added</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
    <!-- Posts Favorited by User -->
    <v-conatiner v-if="!user.favorites.length">
      <v-layout row wrap>
      <v-flex xs12>
        <h2>You have no favorites currently. Go and add some</h2>
      </v-flex>
    </v-layout>
    </v-conatiner>

    <v-container class="mt-3">
      <v-flex xs12 sm6 v-for="favorite in user.favorites" :key="favorite._id">
        <v-card class="mt-3 ml-1 mr-2" hover>
          <v-card-media height="30vh" :src="favorite.imageUrl"></v-card-media>
          <v-card-text>{{favorite.title}}</v-card-text>
        </v-card>
      </v-flex>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  computed: {
    ...mapGetters(['user'])
  }
}
</script>

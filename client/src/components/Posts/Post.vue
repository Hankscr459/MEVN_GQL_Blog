<template>
  <v-container v-if="getPost">

    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon @click="geToPreviousPage" color="info" large>arrow_back</v-icon>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img @click="toggleImageDialog" slot="activator" :src="getPost.imageUrl" id="post__image"></v-img>
          </v-tooltip>
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="500px"></v-img>
            </v-card>
          </v-dialog>
          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-flex xs12>
        <v-form @submit.prevent="handleAddPostMessage">
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                v-model="messageBody"
                clearable
                :append-outer-icon="messageBody && 'send'"
                @click:append-outer="handleAddPostMessage"
                label="Add Message"
                type="text"
                prepend-icon="email"
                required
              >
              </v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <v-list subheader two-line>
                <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>
                <template v-for="message in getPost.messages">
                  <v-list-tile avatar inset :key="message.title">
                    <v-list-tile-avatar>
                      <img :src="message.messageUser.avatar">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>
                        {{message.messageBody}}
                      </v-list-tile-title>
                      <v-list-tile-sub-title>
                        {{message.messageUser.username}}
                        <span class="grey--text text--lighten-1 hidden-xs-only">{{message.messageDate}}</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action class="hidden-xs-only">
                      <v-icon color="grey">chat_bubble</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { ADD_POST_MESSAGE, GET_POST } from '../../queries'

export default {
  name: 'Post',
  props: ['postId'],
  data () {
    return {
      dialog: false,
      messageBody: ''
    }
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables () {
        return {
          postId: this.postId
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleAddPostMessage () {
      const variables = {
        messageBody: this.messageBody,
        userId: this.user._id,
        postId: this.postId
      }
      this.$apollo.mutate({
        mutation: ADD_POST_MESSAGE,
        variables,
        update: (cache, { data: { addPostMessage } }) => {
          const data = cache.readQuery({
            query: GET_POST,
            variables: { postId: this.postId }
          })

          data.getPost.messages.unshift(addPostMessage)

          // console.log('data: ', data)
          // console.log('add post message', addPostMessage)
          cache.writeQuery({
            query: GET_POST,
            variables: { postId: this.postId },
            data
          })
        }
      })
        .then(({ data }) => {
          console.log(data.addPostMessage)
        })
        .catch(err => console.log(err))
    },
    geToPreviousPage () {
      this.$router.go(-1)
    },
    toggleImageDialog () {
      if (window.innerHeight > 500) {
        this.dialog = !this.dialog
      }
    }
  }
}
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>

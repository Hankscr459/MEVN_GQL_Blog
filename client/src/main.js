import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'

import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'

import FormAlert from './components/Shared/FormAlert.vue'

// Register global Components
Vue.component('form-alert', FormAlert)

Vue.use(VueApollo)

export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // include auth token request made to backend
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if no token with kind of 'token' in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem('token', '')
    }
    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError)
    }

    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        console.dir(err)
      }
    }
  }
})

const apolloProvider = new VueApollo({ defaultClient })

Vue.config.productionTip = false

new Vue({
  provide: apolloProvider,
  router,
  store,
  render: h => h(App),
  created () {
    // execute getCurrentUser query
    this.$store.dispatch('getCurrentUser')
  }
}).$mount('#app')

import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'

import { GET_CURRENT_USER, GET_POSTS, SIGNIN_USER } from '../queries'
import { defaultClient as apolloClient } from '../main'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false,
    error: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload
    },
    setUser: (state, payload) => {
      state.user = payload
    },
    setLoading: (state, payload) => {
      state.loading = payload
    },
    setError: (state, payload) => {
      state.error = payload
    },
    clearUser: state => {
      state.user = null
    },
    clearError: state => {
      state.error = null
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true)
      apolloClient.query({
        query: GET_CURRENT_USER
      }).then(({ data }) => {
        commit('setLoading', false)
        // Add user data to state
        commit('setUser', data.getCurrentUser)
        console.log(data.getCurrentUser)
      }).catch(err => {
        commit('setLoading', false)
        console.log(err)
      })
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true)
      apolloClient
        .query({
          query: GET_POSTS
        }).then(({ data }) => {
          commit('setPosts', data.getPosts)
          commit('setLoading', false)
        })
        .catch(err => {
          commit('setLoading', false)
          console.error(err)
        })
    },
    signinUser: ({ commit }, payload) => {
      commit('clearError')
      // clear token to prevent errors
      localStorage.setItem('token', '')
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem('token', data.signinUser.token)
          // to make sure created method is run in main.js (we run currrentUser), reload the page
          router.go()
        })
        .catch(err => {
          commit('setError', err)
          console.log(err)
        })
    },
    signoutUser: async ({ commit }) => {
      // clean user in state
      commit('clearUser', null)
      // remove token in localstorage
      localStorage.setItem('token', '')
      // end session
      await apolloClient.resetStore()
      // redirect home kick users out of private pages (i.e profile)
      router.push('/')
    }
  },
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading,
    error: state => state.error
  },
  modules: {
  }
})

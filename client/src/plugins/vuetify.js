import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#26A69A',
    secondary: '#80CBC4',
    accent: '#2c7a85',
    error: '#D50000',
    warning: '#FFC107',
    info: '#2979FF',
    success: '#1B5E20'
  }
})

// Vue.use(Vuetify, {
//   theme: {
//     primary: colors.teal.lighten1,
//     secondary: colors.teal.lighten3,
//     accent: colors.red.lighten1,
//     error: colors.red.accent1,
//     warning: colors.amber.base,
//     info: colors.blue.accent3,
//     success: colors.green.darken4
//   }
// })

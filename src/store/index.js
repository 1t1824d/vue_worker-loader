import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  getters: {
    GetCustomChartsData: state => state.CustomChartsData,

  },
  state: {
    CustomChartsData: [],




  },
  mutations: {
    set_CustomChartsData: (state, data) => state.CustomChartsData = data,


  },

  actions: {
    async CustomChartsDataFun({ commit }, data) {
      await commit('set_CustomChartsData', data);

    },

  },
  modules: {
  }
})

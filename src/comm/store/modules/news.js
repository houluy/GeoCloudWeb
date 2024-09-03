const state = {
  newsData: '',
  allYxData:{},
  changeDataList:''
}

const mutations = {
  SET_NEWS_DATA: (state, newsData) => {
    state.newsData = newsData
  },
  SET_ALL_YX_DATA: (state, allYxData) =>{
    state.allYxData = allYxData
  },
  SET_CHANGE_DATA_LIST: (state, changeDataList) =>{
    state.changeDataList = changeDataList
  }
}

const actions = {
  setNewsData ({
    commit,
    state
  }, newsData) {
    commit('SET_NEWS_DATA', newsData)
  },
  setChangeDataList ({
                 commit,
                 state
               }, newsData) {
    commit('SET_CHANGE_DATA_LIST', newsData)
  },
  setAllYxData ({
                 commit,
                 state
               }, newsData) {
    commit('SET_ALL_YX_DATA', newsData)
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations
}

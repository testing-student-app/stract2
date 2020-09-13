const state = {
  connected: [],
};

const mutations = {
  get: (state, action) => {
    state.connected = action.clients;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};

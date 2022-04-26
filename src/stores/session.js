import { defineStore } from "pinia";
import SecureLS from "secure-ls";

var ls = new SecureLS({encodingType: 'aes'});

export const useSessionStore = defineStore("counter", {
  state: () => {
    return {
      currentUser: null,
    };
  },
  getters: {
    getCurrentUser(state) {
      let user = null;

      if (state.currentUser) {
        user = state.currentUser;
      } else {
        user = ls.get('activeSession');
      }

      return user;
    }
  },
  actions: {
    setUser(user) {
      this.currentUser = user;
    },
    saveToLocalStorage() {
      ls.set('activeSession', this.currentUser) 
    },
    getFromLocalStorage() {
      this.currentUser = ls.get('activeSession');
    }
  },
});

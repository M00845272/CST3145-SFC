<template>
  <div id="app">
      <header>
          <h1>{{ sitename }}</h1>
          <button @click="showCheckout">{{ this.cart.length }}
              Checkout</button>
      </header>
      <main>
          <component :is="currentView"></component>
      </main>
  </div>
</template>
<script>
import LessonList from "./components/LessonList.vue";
import Checkout from "./components/Checkout.vue";
export default {
  name: "App",
  data() {
      return {
          sitename: "Vue.js Pet Depot",
          cart: [],
          currentView: LessonList
      }
  },
  components: { LessonList, Checkout },
  methods: {
      showCheckout() {
          if (this.currentView === LessonList) return true;
          return false;
      }
  }
};
</script>
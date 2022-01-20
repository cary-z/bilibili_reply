
import Vue from 'vue'
import { Router } from 'vue-router'
declare module 'vue/types/vue' {
  interface Vue {
    $router: Router
    // $route: Route
  }
}
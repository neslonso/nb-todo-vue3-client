import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Swal from "sweetalert2";
import LoginComponent from "@/components/LoginComponent.vue";
import TaskListComponent from "@/components/TaskListComponent.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/tareas" },
  {
    path: "/login",
    name: "login",
    component: LoginComponent,
    meta: {
      public: true, // No requiere autentificación
    },
  },
  {
    path: "/tareas",
    name: "tareas",
    component: TaskListComponent,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  /*
  console.log("to", to);
  console.log("from", from);
  console.log("next", next);
  */
  const loggedIn = localStorage.getItem("user"); // Asumimos que el usuario está autentificado si hay un "user" en localStorage

  if (from.path == "/" && to.path != "/login" && !loggedIn) {
    return next({ path: "/login" });
  }

  if (!to.meta.public && !loggedIn) {
    // Si la ruta no es pública y el usuario no está autentificado, redirige a la página de login
    Swal.fire({
      icon: "error",
      title: "Tsk, tsk...",
      text: "No me consta que estés autentificado, así que... tira pa'l login",
      showConfirmButton: true,
      timer: 7000,
      timerProgressBar: true,
    });
    return next({ path: "/login" });
  }

  next();
});

export default router;

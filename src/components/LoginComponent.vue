<template>
  <div
    class="flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="flex items-center justify-center">
        <h2 class="da-logo mt-6 text-3xl font-extrabold text-gray-900">
          <img
            :src="require('@/assets/logo.png')"
            alt="Logo"
            style="width: 7em"
          />
          <h3 class="text-5xl">TO DO LIST</h3>
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="onSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ApiService from "@/services/ApiService";
import Swal from "sweetalert2";

@Options({
  name: "LoginComponent",
  components: {},
})
export default class LoginComponent extends Vue {
  email = "";
  password = "";

  loader: any;
  is_loading = false;

  toggleLoading() {
    if (this.is_loading) {
      this.loader.hide();
      this.is_loading = false;
      return;
    }
    this.loader = this.$loading.show({
      loader: "dots",
    });
    this.is_loading = true;
  }

  async login() {
    try {
      this.toggleLoading();
      const logged = await ApiService.login(this.email, this.password);
      this.toggleLoading();
      if (logged) {
        this.$router.push({ name: "tareas" });
        localStorage.setItem("user", this.email); // Asumimos que el usuario está autentificado si hay un "user" en localStorage

        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: "Has iniciado sesión correctamente",
          showConfirmButton: true,
          timer: 7000,
          timerProgressBar: true,
        });
      }
      // Aquí deberías manejar la respuesta, como guardar el token y redirigir al usuario a la página que desees
    } catch (error) {
      console.error(error);
      // Maneja los errores, como mostrar un mensaje de error al usuario
    }
  }

  onSubmit() {
    this.login();
  }
}
</script>

<style lang="scss" scoped>
$text-border-color: aquamarine;
.da-logo {
  position: relative;

  h3 {
    position: absolute;
    top: 25%;
    left: 0;
    color: rgba(0, 0, 0, 0.37);
    transform: rotate(-30deg);
    -webkit-text-stroke: 0.037em $text-border-color;
  }
}
</style>

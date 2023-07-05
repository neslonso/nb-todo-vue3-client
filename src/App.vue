<template>
  <nav>
    <router-link to="/tareas">Tareas</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <section class="main">
    <router-view />
  </section>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  position: fixed;
  width: 100vw;
  padding: 30px;
  @apply p-4 mb-4 bg-white rounded shadow-lg;

  a {
    font-weight: bold;
    color: #2c3e50;

    &:hover {
      color: #42b983;
    }

    &.router-link-exact-active {
      @apply text-3xl;
      color: #42b983;
    }
  }
}

section.main {
  padding: 100px;
}

.swal2-container ul {
  text-align: initial;
  list-style: auto;
  list-style-type: disc;
  padding: revert;
}
</style>

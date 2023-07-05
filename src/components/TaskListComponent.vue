<template>
  <div class="container mx-auto p-8 bg-gray-100 max-w-7xl">
    <!-- New Task -->
    <NewTaskComponent
      @saved="onSavedTask"
      :categories="categories"
    ></NewTaskComponent>
    <!-- /New Task -->

    <!-- Task list -->
    <div>
      <TaskComponent
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :categories="categories"
        @deleted="onDeletedTask"
      ></TaskComponent>
    </div>
    <!-- /task list -->
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Swal from "sweetalert2";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
import VueMultiselect from "vue-multiselect";

import { ApiConsumerComposable } from "@/composables/ApiConsumerComposable";
import ApiService from "@/services/ApiService";
import { Task } from "@/models/Task";
import { Category } from "@/models/Category";
import TaskComponent from "@/components/TaskComponent.vue";
import NewTaskComponent from "@/components/NewTaskComponent.vue";

@Options({
  name: "TaskListComponent",
  components: {
    PlusCircleIcon,
    VueMultiselect,
    TaskComponent,
    NewTaskComponent,
  },
})
export default class TaskListComponent extends Vue {
  /*
  toggleLoadingComposable!: (
    $loading: any,
    loader: any,
    is_loading: boolean
  ) => any;
  */
  tratarApiError!: (error: any) => void;

  categories: Category[] = [];

  tasks: Task[] = [];
  newTask: Task = {
    id: 0,
    title: "",
    description: "",
    is_completed: false,
    categories: [],
  };
  newTaskModalisOpen = false;

  loader: any;
  is_loading = false;

  async created() {
    //this.toggleLoadingComposable = ApiConsumerComposable().toggleLoading;
    this.tratarApiError = ApiConsumerComposable().tratarApiError;

    this.toggleLoading();
    await this.getTasks();
    await this.getCategories();
    this.toggleLoading();
  }

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

  /*
  toggleLoading() {
    let { loader, is_loading } = this.toggleLoadingComposable(
      this.$loading,
      this.loader,
      this.is_loading
    );
    this.loader = loader;
    this.is_loading = is_loading;
  }
  */

  async getTasks() {
    try {
      const response = await ApiService.getTasks();
      if (!response.status.error && response.payload) {
        this.tasks = response.payload.tasks.map((task: Task) => ({
          ...task,
          showDetails: false,
        }));
      }
      if (response.data.status.error) {
        Swal.fire({
          icon: "error",
          title: "Tsk, tsk...",
          text: "Error obteniendo tareas: " + response.data.status.message,
          showConfirmButton: true,
        });
      }
    } catch (error: any) {
      this.tratarApiError(error);
    }
  }

  async getCategories() {
    try {
      const response = await ApiService.getCategories();
      if (!response.status.error && response.payload) {
        this.categories = response.payload.categories;
      }
      if (response.data.status.error) {
        Swal.fire({
          icon: "error",
          title: "Tsk, tsk...",
          text: "Error obteniendo categorías: " + response.data.status.message,
          showConfirmButton: true,
        });
      }
    } catch (error: any) {
      this.tratarApiError(error);
    }
  }

  onSavedTask(task: Task) {
    this.tasks.push(task);
  }

  onDeletedTask(taskId: number) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }
}
</script>

<style scoped>
li:hover {
  background-image: linear-gradient(to left, white, var(--tw-gradient-to));
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.css"></style>

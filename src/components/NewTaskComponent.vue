<template>
  <button
    @click="newTaskModalisOpen = true"
    class="p-2 mb-3 bg-blue-500 text-white rounded"
  >
    <PlusCircleIcon class="inline-block w-6 h-6" /> Añadir nueva tarea
  </button>

  <!-- New Task dialog -->
  <div
    v-if="newTaskModalisOpen"
    class="fixed inset-0 bg-black opacity-50 z-50"
  ></div>

  <div
    v-if="newTaskModalisOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div class="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4">
      <h2 class="text-xl font-semibold mb-2">Añadir nueva tarea</h2>

      <div class="flex flex-col">
        <label for="titulo" class="mb-2">Titulo</label>
        <input
          id="titulo"
          type="text"
          class="block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black rounded"
          v-model="newTask.title"
          placeholder="Titulo"
        />
      </div>

      <div class="flex flex-col">
        <label for="descripcion" class="mb-2">Descripcion</label>
        <ckeditor
          id="descripcion"
          :editor="editor"
          v-model="newTask.description"
          :config="editorConfig"
        ></ckeditor>
      </div>

      <div class="flex flex-col">
        <label for="categorias" class="mb-2">Categorías:</label>
        <div>
          <VueMultiselect
            v-model="newTask.categories"
            :options="categories"
            :multiple="true"
            :limit="3"
            :limit-text="(count: number) => `y ${count} más`"
            :close-on-select="false"
            :clear-on-select="false"
            :searchable="false"
            :preserve-search="true"
            placeholder="Seleccione categorías"
            label="name"
            track-by="name"
            selectLabel="Entor para seleccionar"
            selectedLabel="Seleccionado"
            deselectLabel="Enter para deseleccionar"
          >
          </VueMultiselect>
        </div>
      </div>

      <button
        @click="addNewTask"
        class="w-full p-2 bg-blue-500 text-white rounded"
      >
        Guardar
      </button>

      <button
        @click="newTaskModalisOpen = false"
        class="w-full p-2 bg-red-500 text-white rounded mt-4"
      >
        Cerrar
      </button>
    </div>
  </div>
  <!-- /New Task dialog -->
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import Swal from "sweetalert2";
import { PlusCircleIcon } from "@heroicons/vue/24/solid";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "@ckeditor/ckeditor5-build-classic/build/translations/es";
import VueMultiselect from "vue-multiselect";

import { ApiConsumerComposable } from "@/composables/ApiConsumerComposable";
import ApiService from "@/services/ApiService";
import { Task } from "@/models/Task";
import { Category } from "@/models/Category";

@Options({
  name: "NewTaskComponent",
  components: {
    PlusCircleIcon,
    ckeditor: CKEditor.component,
    VueMultiselect,
  },
  props: {
    categories: {
      required: true,
    },
  },
  emits: ["saved"],
})
export default class NewTaskComponent extends Vue {
  /*
    toggleLoadingComposable!: (
      $loading: any,
      loader: any,
      is_loading: boolean
    ) => any;
    */
  tratarApiError!: (error: any) => void;

  categories!: Category[];

  tasks: Task[] = [];
  newTask: Task = {
    id: 0,
    title: "",
    description: "",
    is_completed: false,
    categories: [],
  };
  newTaskModalisOpen = false;

  editor = ClassicEditor;
  editorConfig = {
    language: "es",
  };

  loader: any;
  is_loading = false;

  async created() {
    //this.toggleLoadingComposable = ApiConsumerComposable().toggleLoading;
    this.tratarApiError = ApiConsumerComposable().tratarApiError;
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

  async addNewTask() {
    let errors: string[] = [];
    if (this.newTask.title.trim() === "") {
      errors.push("El titulo no puede estar vacio");
    }

    if (this.newTask.description.trim() === "") {
      errors.push("La descripción no puede estar vacia");
    }

    if (errors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Problemas con los datos introducidos",
        html: "<ul><li>" + errors.join("</li><li>") + "</li></ul>",
        showConfirmButton: true,
        timer: 70000,
        timerProgressBar: true,
      });
      return;
    }

    const newTask = {
      ...this.newTask,
    };

    try {
      console.log("newTask", newTask);
      this.toggleLoading();
      const response = await ApiService.saveTask(newTask);
      if (!response.status.error) {
        this.tasks.push(newTask);
        this.newTaskModalisOpen = false;
        this.$emit("saved", this.newTask);
        this.newTask = {
          id: 0,
          title: "",
          description: "",
          is_completed: false,
          categories: [],
        };

        Swal.fire({
          icon: "success",
          title: "¡Tarea guardada!",
          text: "La tarea se ha guardado correctamente",
          showConfirmButton: true,
          timer: 7000,
          timerProgressBar: true,
        });
      }
    } catch (error: any) {
      this.tratarApiError(error);
    } finally {
      this.toggleLoading();
    }
  }

  onDeleteTask(taskId: number) {
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

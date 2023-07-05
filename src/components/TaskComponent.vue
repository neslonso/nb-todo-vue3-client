<template>
  <div
    ref="taskContainer"
    style="position: relative"
    :class="
      task.is_completed
        ? 'p-4 mb-4 bg-gradient-to-l from-green-300 to-green-500 rounded shadow-lg'
        : 'p-4 mb-4 bg-gradient-to-l from-red-300 to-red-500 rounded shadow-lg'
    "
  >
    <div class="flex items-center justify-between">
      <div>
        <div class="app-button" @click.stop="toggleDetails()">
          <span class="sr-only">Open/Close task</span>
          <FolderIcon v-if="!showDetails" class="w-6 h-6" />
          <FolderOpenIcon v-else class="w-6 h-6" />
        </div>
      </div>
      <input
        id="titulo"
        type="text"
        class="text-2xl font-semibold text-gray-800 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black rounded"
        v-model="task.title"
        placeholder="Titulo"
        @click.stop=""
      />
      <div style="white-space: nowrap">
        <div class="app-button" @click.stop="saveTask(task.id)">
          <span class="sr-only">Save task</span>
          <ArchiveBoxArrowDownIcon class="w-6 h-6" />
        </div>
        <div v-if="task.is_completed" class="app-button">
          <span class="sr-only">Completed</span>
          <div @click.stop="toggleCompleted(task.id)">
            <XCircleIcon class="w-6 h-6" />
          </div>
        </div>
        <div v-else class="app-button">
          <span class="sr-only">Not Completed</span>
          <div @click.stop="toggleCompleted(task.id)">
            <CheckCircleIcon class="w-6 h-6" />
          </div>
        </div>
        <div class="app-button" @click.stop="deleteTask(task.id)">
          <span class="sr-only">Delete task</span>
          <TrashIcon class="w-6 h-6" />
        </div>
      </div>
    </div>
    <div
      v-if="showDetails"
      class="p-4 mt-4 text-gray-700 bg-slate-300 bg-opacity-50 rounded shadow-lg"
    >
      <ckeditor
        id="descripcion"
        :editor="editor"
        v-model="task.description"
        :config="editorConfig"
      ></ckeditor>
      <div class="mt-4"></div>
      <VueMultiselect
        v-model="task.categories"
        :options="categories"
        :multiple="true"
        :limit="13"
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
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import { ref } from "vue";
import {
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ArchiveBoxArrowDownIcon,
  FolderIcon,
  FolderOpenIcon,
} from "@heroicons/vue/24/solid";

import { ApiConsumerComposable } from "@/composables/ApiConsumerComposable";
import ApiService from "@/services/ApiService";
import { Task } from "@/models/Task";
import { Category } from "@/models/Category";
import Swal from "sweetalert2";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import VueMultiselect from "vue-multiselect";

@Options({
  name: "TaskComponent",
  components: {
    CheckCircleIcon,
    XCircleIcon,
    TrashIcon,
    ArchiveBoxArrowDownIcon,
    FolderIcon,
    FolderOpenIcon,
    VueMultiselect,
    ckeditor: CKEditor.component,
  },
  props: {
    task: {
      required: true,
    },
    categories: {
      required: true,
    },
  },
  emits: ["deleted"],
})
export default class TaskComponent extends Vue {
  taskContainer = ref<HTMLElement | null>(null);
  tratarApiError!: (error: any) => void;

  categories!: Category[];

  task!: Task;
  loader: any;
  is_loading = false;

  editor = ClassicEditor;
  editorConfig = {
    language: "es",
  };
  showDetails = false;

  created() {
    this.tratarApiError = ApiConsumerComposable().tratarApiError;
  }

  toggleLoading() {
    if (this.is_loading) {
      this.loader.hide();
      this.is_loading = false;
      return;
    }
    //const loaderContainer: HTMLElement = this.taskContainer.value;
    this.loader = this.$loading.show({
      loader: "dots",
      container: this.taskContainer,
    });
    this.is_loading = true;
  }

  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  async deleteTask(taskId: number) {
    Swal.fire({
      title: "¿Está seguro?",
      text: "Seguramente estará seguro, pero mejor asegurarse...",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Te lo aseguro!",
      cancelButtonText: "Por Tutatis, NO!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.toggleLoading();
          const response = await ApiService.deleteTask(taskId);
          if (!response.status.error) {
            this.$emit("deleted", this.task.id);
          }
        } catch (error: any) {
          this.tratarApiError(error);
        } finally {
          this.toggleLoading();
        }
      }
    });
  }

  async toggleCompleted(taskId: number) {
    try {
      this.toggleLoading();
      const task = this.task;
      if (!task) {
        return;
      }
      const response = await ApiService.toggleCompleted(taskId);
      if (!response.status.error) {
        task.is_completed = !task.is_completed;
      }
    } catch (error: any) {
      this.tratarApiError(error);
    } finally {
      this.toggleLoading();
    }
  }

  async saveTask(taskId: number) {
    try {
      this.toggleLoading();
      const task = this.task;
      if (!task) {
        return;
      }
      const response = await ApiService.saveTask(task);
      if (!response.status.error) {
        /*
        Swal.fire({
          icon: "success",
          title: "¡Tarea guardada!",
          text: "La tarea se ha guardado correctamente",
          showConfirmButton: true,
          timer: 7000,
          timerProgressBar: true,
        });
        */
      }
    } catch (error: any) {
      this.tratarApiError(error);
    } finally {
      this.toggleLoading();
    }
  }
}
</script>

<style scoped>
li:hover {
  background-image: linear-gradient(to left, white, var(--tw-gradient-to));
}

.app-button {
  @apply inline-block p-2 m-2 bg-white rounded-full;
  @apply cursor-pointer;

  &:hover {
    @apply bg-orange-300;
    color: var(--tw-ring-color);
  }
}
</style>

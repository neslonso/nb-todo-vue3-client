import Swal, { SweetAlertIcon } from "sweetalert2";
import { useRouter } from "vue-router";

export function ApiConsumerComposable() {
  const router = useRouter();

  /*
  function toggleLoading($loading: any, loader: any, is_loading: boolean) {
    if (is_loading) {
      loader.hide();
      is_loading = false;
      return;
    }
    loader = $loading.show({});
    is_loading = true;
    return { loader, is_loading };
  }
  */

  function tratarApiError(error: any) {
    switch (error.response?.status) {
      case 401:
        router.push({ name: "login" });
        Swal.fire({
          icon: "error",
          title: "Tsk, tsk...",
          text: "No me consta que estés autentificado, así que... tira pa'l login",
          showConfirmButton: true,
          timer: 7000,
          timerProgressBar: true,
        });

        break;
    }
  }

  return {
    //toggleLoading,
    tratarApiError,
  };
}

import axios, { AxiosResponse } from "axios";
import { Task } from "@/models/Task";

const API_SERVER = "http://localhost";
const API_ENDPOINT = "/api";

class ApiResponse implements ApiResponse {
  status: {
    error: boolean;
    message: string;
  };
  payload: object;

  constructor(error: boolean, message: string, payload: object) {
    this.status = { error, message };
    this.payload = payload;
  }

  static fromJson(jsonString: string): ApiResponse {
    const data = JSON.parse(jsonString);
    return new ApiResponse(
      data.status.error,
      data.status.message,
      data.payload
    );
  }
}

class ApiService {
  constructor() {
    // Configura axios para enviar cookies
    axios.defaults.withCredentials = true;
  }

  async getCsrfToken() {
    try {
      await axios.get(`${API_SERVER}/sanctum/csrf-cookie`);
    } catch (error) {
      console.error("ApiService::getCsrfToken", error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      await this.getCsrfToken();

      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_SERVER}${API_ENDPOINT}/login`,
        {
          email,
          password,
        },
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return !response.data.status.error;
    } catch (error: unknown) {
      console.warn("ApiService::login", error);
      throw error;
    }
  }

  async getTasks(): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${API_SERVER}${API_ENDPOINT}/tasks`,
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.warn("ApiService::getTasks", error);
      throw error;
    }
  }

  async deleteTask(id: number): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.delete(
        `${API_SERVER}${API_ENDPOINT}/tasks/${id}`,
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.warn("ApiService::deleteTask", error);
      throw error;
    }
  }

  async toggleCompleted(id: number): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.put(
        `${API_SERVER}${API_ENDPOINT}/tasks/${id}/complete`,
        {},
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.warn("ApiService::toggleCompleted", error);
      throw error;
    }
  }

  async saveTask(task: Task): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post(
        `${API_SERVER}${API_ENDPOINT}/tasks/${task.id || 0}`,
        task,
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.warn("ApiService::saveTask", error);
      throw error;
    }
  }

  async getCategories(): Promise<any> {
    try {
      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${API_SERVER}${API_ENDPOINT}/categories`,
        {
          transformResponse: (data) => {
            return ApiResponse.fromJson(data);
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.warn("ApiService::getCategories", error);
      throw error;
    }
  }
}

export default new ApiService();

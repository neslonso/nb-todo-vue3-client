interface ApiResponse {
  status: {
    error: boolean;
    message: string;
  };
  payload: object;
}

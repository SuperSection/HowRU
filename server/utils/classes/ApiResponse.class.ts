class ApiResponse {
  public readonly status: number;
  public readonly success: boolean;
  public readonly message: string | Error;
  public readonly data: any;
  constructor(status: number, message: string | Error, data?: any) {
    this.status = status;
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;

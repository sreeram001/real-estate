export interface userBodyRequest {
  id?: number;
  name: string;
  email: string;
  mobile_no: string;
  password: string;
  salt?: string;
  role?: string;
  status: boolean;
  account_count?: number;
  created_by?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface loginRequest {
  input: string;
  password: string;
}

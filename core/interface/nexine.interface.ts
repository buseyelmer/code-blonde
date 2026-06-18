export interface IData<T> {
  data?: T[];
  total?: number;
  page?: number;
  amount?: number;
  message?: string;
}

export interface IDataSingle<T> {
  data?: T;
  message?: string;
}

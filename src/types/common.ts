export interface ResponseData<T> {
  Data: T;
  Message: string;
  Type?: string;
}

export interface BaseResponseModel {
  Id: string;
  CreatedOn: string;
  ModifiedOn: string;
  CreatedBy: string;
  ModifiedBy: string;
}

export interface BaseResponse {
  id: string;
  createdOn: string;
  modifiedOn: string;
  createdBy: string;
  modifiedBy: string;
}
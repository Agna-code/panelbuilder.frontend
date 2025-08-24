import { BaseResponse, BaseResponseModel } from "./common";

export interface DeviceTypeResponse extends BaseResponseModel {
  Name: string;
}

export interface DeviceType extends BaseResponse {
  name: string;
}

export interface PanelTypeResponse extends BaseResponseModel {
  Name: string;
  NumberOfRail: number;
  IsRoomBox: boolean;
}

export interface PanelType extends BaseResponse {
  name: string;
  numberOfRail: number;
  isRoomBox: boolean;
}

export interface ContentAssetResponse extends BaseResponseModel {
  FileName: string;
  FileExtension: string;
  Url: string;
}

export interface ContentAsset extends BaseResponse {
  fileName: string;
  fileExtension: string;
  url: string;
}

export interface DeviceResponse extends BaseResponseModel {
  Name: string;
  Description: string | null;
  PowerMAAdded: number | null;
  PowerMADraw: number | null;
  LogicMaxAllowed: number | null;
  DeviceTypeId: string;
  RailSpace: number | null;
  NumberOfDin: number | null;
  DinSpace: number | null;
  ContentAssets?: ContentAssetResponse[];
}

export interface Device extends BaseResponse {
  name: string;
  description: string | null;
  powerMAAdded: number | null;
  powerMADraw: number | null;
  logicMaxAllowed: number | null;
  deviceTypeId: string;
  railSpace: number | null;
  numberOfDin: number | null;
  dinSpace: number | null;
  contentAssets?: ContentAsset[];
}
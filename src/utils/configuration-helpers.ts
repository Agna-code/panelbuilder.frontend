import { ContentAsset, ContentAssetResponse, Device, DeviceResponse, DeviceType, DeviceTypeResponse, PanelType, PanelTypeResponse } from "../types/configuration";

export const mapDeviceTypeResponseToDeviceType = (response: DeviceTypeResponse): DeviceType => {
  return {
    id: response.Id,
    name: response.Name,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};

export const mapPanelTypeResponseToPanelType = (response: PanelTypeResponse): PanelType => {
  return {
    id: response.Id,
    name: response.Name,
    numberOfRail: response.NumberOfRail,
    isRoomBox: response.IsRoomBox,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};

export const mapContentAssetResponseToContentAsset = (response: ContentAssetResponse): ContentAsset => {
  return {
    id: response.Id,
    fileName: response.FileName,
    fileExtension: response.FileExtension,
    url: response.Url,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};

export const mapDeviceResponseToDevice = (response: DeviceResponse): Device => {
  return {
    id: response.Id,
    name: response.Name,
    description: response.Description,
    powerMAAdded: response.PowerMAAdded,
    powerMADraw: response.PowerMADraw,
    logicMaxAllowed: response.LogicMaxAllowed,
    deviceTypeId: response.DeviceTypeId,
    railSpace: response.RailSpace,
    numberOfDin: response.NumberOfDin,
    dinSpace: response.DinSpace,
    contentAssets: response.ContentAssets?.map(mapContentAssetResponseToContentAsset),
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};
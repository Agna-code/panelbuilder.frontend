import { BaseResponse, BaseResponseModel } from "./common";

export interface ProjectResponse extends BaseResponseModel {
  Name: string;
  CompanyName: string;
  Location: string;
}

export interface Project extends BaseResponse {
  name: string;
  companyName: string;
  location: string;
}

export interface FixtureResponse extends BaseResponseModel {
  Name: string;
  Type: string;
  ControlType: string;
  Wattage: number;
  Voltage: number;
  Description: string | null;
  ProjectId: string;
}

export interface Fixture extends BaseResponse {
  name: string;
  type: string;
  controlType: string;
  wattage: number;
  voltage: number;
  description: string | null;
  projectId: string;
}

export interface ZoneResponse extends BaseResponseModel {
  Name: string;
  FixtureId: string;
  Quantity: number;
  Circuit: string;
  Area: string;
  IsEmergency: boolean;
}

export interface Zone extends BaseResponse {
  name: string;
  fixtureId: string;
  quantity: number;
  circuit: string;
  area: string;
  isEmergency: boolean;
}

export interface ProjectDetailsResponse {
  Project: ProjectResponse;
  Fixtures: FixtureResponse[];
  Zones: ZoneResponse[];
}

export interface ProjectDetails {
  project: Project;
  fixtures: Fixture[];
  zones: Zone[];
}
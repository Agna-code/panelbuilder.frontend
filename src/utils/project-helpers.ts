import { Fixture, FixtureResponse, Project, ProjectResponse, Zone, ZoneResponse } from "../types/project";

export const mapProjectResponseToProject = (response: ProjectResponse): Project => {
  return {
    id: response.Id,
    name: response.Name,
    companyName: response.CompanyName,
    location: response.Location,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};

export const mapFixtureResponseToFixture = (response: FixtureResponse): Fixture => {
  return {
    id: response.Id,
    name: response.Name,
    type: response.Type,
    controlType: response.ControlType,
    wattage: response.Wattage,
    voltage: response.Voltage,
    description: response.Description,
    projectId: response.ProjectId,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};

export const mapZoneResponseToZone = (response: ZoneResponse): Zone => {
  return {
    id: response.Id,
    name: response.Name,
    fixtureId: response.FixtureId,
    quantity: response.Quantity,
    circuit: response.Circuit,
    area: response.Area,
    isEmergency: response.IsEmergency,
    createdOn: response.CreatedOn,
    modifiedOn: response.ModifiedOn,
    createdBy: response.CreatedBy,
    modifiedBy: response.ModifiedBy,
  };
};
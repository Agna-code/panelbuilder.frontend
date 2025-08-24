import { createContext, useContext, useState } from 'react';
import {
  Project,
  ProjectDetails,
  ProjectDetailsResponse,
  ProjectResponse,
} from '../types/project';
import { ResponseData } from '../types/common';
import backendApi from '../services/backendApi';
import {
  mapFixtureResponseToFixture,
  mapProjectResponseToProject,
  mapZoneResponseToZone,
} from '../utils/project-helpers';

interface ProjectContextType {
  projects: Project[];
  fetchProjects: () => Promise<Project[]>;
  createProject: (name: string, companyName: string, location: string, fixtureCSV: File, zoneCSV: File) => Promise<ProjectDetails | null>;
  fetchProjectById: (id: string) => Promise<ProjectDetails | null>;
  updateProject: (id: string, project: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  cloneProject: (
    id: string,
    projectName: string
  ) => Promise<ProjectDetails | null>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const response = await backendApi.get<ResponseData<ProjectResponse[]>>(
        '/projects'
      );
      if (response.data.Data) {
        const fetchedProjects = response.data.Data.map(
          mapProjectResponseToProject
        );
        setProjects(fetchedProjects);
        return fetchedProjects;
      }
      throw new Error('Failed to fetch projects');
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };
  const createProject = async (
    name: string,
    companyName: string,
    location: string,
    fixtureCSV: File,
    zoneCSV: File
  ): Promise<ProjectDetails | null> => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('companyName', companyName);
      formData.append('location', location);
      formData.append('fixtureCSV', fixtureCSV);
      formData.append('zoneCSV', zoneCSV);
      const response = await backendApi.post<ResponseData<ProjectDetailsResponse>>(
        `/projects`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.Data) {
        const createdProject = mapProjectResponseToProject(response.data.Data.Project);
        const createdFixtures = response.data.Data.Fixtures.map(
          mapFixtureResponseToFixture
        );
        const createdZones = response.data.Data.Zones.map(mapZoneResponseToZone);
        setProjects([createdProject, ...projects]);
        return { project: createdProject, fixtures: createdFixtures, zones: createdZones };
      }
      throw new Error('Failed to create project');
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const fetchProjectById = async (
    id: string
  ): Promise<ProjectDetails | null> => {
    try {
      const response = await backendApi.get<
        ResponseData<ProjectDetailsResponse>
      >(`/projects/${id}`);
      if (response.data.Data) {
        const project = mapProjectResponseToProject(response.data.Data.Project);
        const fixtures = response.data.Data.Fixtures.map(
          mapFixtureResponseToFixture
        );
        const zones = response.data.Data.Zones.map(mapZoneResponseToZone);
        return { project, fixtures, zones };
      }
      return null;
    } catch (error) {
      console.error('Error fetching project by id:', error);
      return null;
    }
  };

  const updateProject = async (
    id: string,
    project: Partial<Project>
  ): Promise<Project | null> => {
    try {
      const response = await backendApi.patch<ResponseData<ProjectResponse>>(
        `/projects/${id}`,
        project
      );
      if (response.data.Data) {
        const updatedProject = mapProjectResponseToProject(response.data.Data);
        setProjects(projects.map((p) => (p.id === id ? updatedProject : p)));
        return updatedProject;
      }
      throw new Error('Failed to update project');
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const response = await backendApi.delete<ResponseData<boolean>>(
        `/projects/${id}`
      );
      if (response.status === 200) {
        setProjects(projects.filter((p) => p.id !== id));
        return true;
      }
      throw new Error('Failed to delete project');
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };

  const cloneProject = async (
    id: string,
    projectName: string
  ): Promise<ProjectDetails | null> => {
    try {
      const response = await backendApi.post<
        ResponseData<ProjectDetailsResponse>
      >(`/projects/${id}/clone`, {
        name: projectName,
      });
      if (response.data.Data) {
        const clonedProject = mapProjectResponseToProject(
          response.data.Data.Project
        );
        const clonedFixtures = response.data.Data.Fixtures.map(
          mapFixtureResponseToFixture
        );
        const clonedZones = response.data.Data.Zones.map(mapZoneResponseToZone);
        const clonedProjectDetails = {
          project: clonedProject,
          fixtures: clonedFixtures,
          zones: clonedZones,
        };
        setProjects([...projects, clonedProject]);
        return clonedProjectDetails;
      }
      throw new Error('Failed to clone project');
    } catch (error) {
      console.error('Error cloning project:', error);
      return null;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        fetchProjects,
        createProject,
        fetchProjectById,
        updateProject,
        deleteProject,
        cloneProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

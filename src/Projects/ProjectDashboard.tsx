import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewProjectModal from './NewProjectModal';
import { projectApi } from '../services/backendApi';
import { PencilIcon, ClipboardDocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import IlumentoLogo from '../../assets/ilumento-logo.svg';


export interface Project {
  id: string;
  name: string;
  company_name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface EditProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: project.name,
    company_name: project.company_name,
    location: project.location,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...project,
      ...formData,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Project</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProjectDashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const navigate = useNavigate();

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getProjects();
      setProjects(data);
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      setError(
        `Failed to load projects: ${error.response?.data?.error || error.message || 'Unknown error'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleProjectClick = (projectId: string) => {
    navigate(`/panel-builder/${projectId}`);
  };

  const handleProjectCreated = async () => {
    setIsModalOpen(false);
    await loadProjects();
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectApi.deleteProject(projectId);
        await loadProjects();
      } catch (error: any) {
        setError(`Failed to delete project: ${error.message}`);
      }
    }
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
  };

  const handleSaveEdit = async (updatedProject: Project) => {
    try {
      await projectApi.updateProject(updatedProject.id, updatedProject);
      setEditingProject(null);
      await loadProjects();
    } catch (error: any) {
      setError(`Failed to update project: ${error.message}`);
    }
  };

  const handleCloneProject = async (projectId: string, projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newName = `${projectName} (Copy)`;
      await projectApi.cloneProject(projectId, newName);
      await loadProjects();
    } catch (error: any) {
      setError(`Failed to clone project: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading projects...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-lg text-red-600 mb-4">{error}</div>
        <button
          onClick={loadProjects}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-800">Projects</h1>
        <button
  onClick={() => setIsModalOpen(true)}
  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
>
  Start Project
</button>

      </div>

      <div className="bg-white rounded-lg shadow">
        {projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No projects found. Click "Start Project" to create one.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-gray-800">{project.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {project.company_name} • {project.location}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Created: {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => handleEditProject(project, e)}
                    className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit project"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleCloneProject(project.id, project.name, e)}
                    className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="Clone project"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete project"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <NewProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {editingProject && (
        <EditProjectModal
          project={editingProject}
          isOpen={true}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default ProjectDashboard; 
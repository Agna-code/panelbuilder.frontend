import React, { useEffect, useMemo, useState } from 'react';
import { LoadingButton } from '../common/LoadingButton';
import { EditButton, CloneButton, DeleteButton } from '../common/ActionButtons';
import { ProjectModal } from './ProjectModal';
import { CloneProjectModal } from './CloneProjectModal';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types/project';
import { colors } from '../constants/colors';
import { FormContainer } from '../common/FormContainer';

export const ProjectPage: React.FC = () => {
  const { projects, fetchProjects, deleteProject } = useProject();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'Create' | 'Edit'>('Create');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCloneOpen, setIsCloneOpen] = useState(false);
  const [cloningProject, setCloningProject] = useState<Project | null>(null);
  

  // Only call fetchProjects once on mount
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(query));
  }, [projects, searchQuery]);

  const openCreateModal = async () => {
    setIsModalOpen(false);
    await new Promise((r) => setTimeout(r, 50));
    setModalMode('Create');
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (project: Project) => {
    setIsModalOpen(false);
    await new Promise((r) => setTimeout(r, 50));
    setModalMode('Edit');
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const openCloneModal = (project: Project) => {
    setCloningProject(project);
    setIsCloneOpen(true);
  };

  return (
    <div className="h-screen flex flex-col p-6 w-full max-w-[760px] mx-0 pt-8 overflow-hidden">
      <div className={`transition-all duration-300 h-full flex flex-col ${(isModalOpen || isCloneOpen) ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-work-sans font-medium" style={{ color: colors.primary.main }}>My Projects</h1>
          </div>
          <LoadingButton onClick={openCreateModal} variant="primary" className="text-sm py-1">
            ADD NEW
          </LoadingButton>
        </div>

        {/* Search */}
        <div className="flex flex-col space-y-6 mb-4 mt-4">
          <FormContainer width="100%" height="56px" className="flex flex-col items-start p-0 isolate">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search projects"
                className="w-full h-[56px] px-12 py-4 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: '4px',
                  color: colors.text.primary,
                  borderColor: colors.border.light,
                  ['--tw-ring-color' as string]: colors.primary.main,
                }}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 19L14.65 14.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          </FormContainer>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-500 p-4">No projects found</div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-green-200 hover:bg-green-50 transition-all duration-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.companyName} • {project.location}</p>
                  </div>
                  <div className="flex gap-2">
                    <EditButton onClick={() => openEditModal(project)} />
                    <CloneButton onClick={() => openCloneModal(project)} />
                    <DeleteButton onClick={() => handleDelete(project.id)} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProject(null);
          }}
          mode={modalMode}
          initialData={editingProject}
        />
      )}
      {isCloneOpen && (
        <CloneProjectModal
          isOpen={isCloneOpen}
          onClose={() => { setIsCloneOpen(false); setCloningProject(null); }}
          project={cloningProject}
        />
      )}
    </div>
  );
};

export default ProjectPage;
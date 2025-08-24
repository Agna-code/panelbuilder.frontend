import React, { useMemo, useState } from 'react';
import { Modal } from '../common/Modal';
import { TextInput } from '../common/TextInput';
import { LoadingButton } from '../common/LoadingButton';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types/project';

// Unified form state for the modal
interface ProjectFormData {
  name: string;
  companyName: string;
  location: string;
  fixtureCSV: File | null;
  zoneCSV: File | null;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'Create' | 'Edit';
  initialData?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  mode = 'Create',
  initialData,
}) => {
  const { createProject, updateProject } = useProject();
  const [formData, setFormData] = useState<ProjectFormData>(() => ({
    name: initialData?.name || '',
    companyName: initialData?.companyName || '',
    location: initialData?.location || '',
    fixtureCSV: null,
    zoneCSV: null,
  }));
  const [isLoading, setIsLoading] = useState(false);
  const fixtureInputId = useMemo(() => `fixture-file-${Math.random().toString(36).slice(2)}`, []);
  const zoneInputId = useMemo(() => `zone-file-${Math.random().toString(36).slice(2)}`, []);

  // formData initialized above directly from props on mount.

  // Generic change handler for inputs using the shared form type
  const handleChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      let project: Project | null = null;
      if (mode === 'Create') {
        if (!formData.fixtureCSV || !formData.zoneCSV) {
          alert('Please select both Fixture CSV and Zone CSV files.');
          setIsLoading(false);
          return;
        }
        const projectDetails = await createProject(
          formData.name,
          formData.companyName,
          formData.location,
          formData.fixtureCSV,
          formData.zoneCSV
        );
        if (projectDetails) {
          project = projectDetails.project;
        }
      } else if (mode === 'Edit' && initialData) {
        const updated: Partial<Project> = {
          id: initialData.id,
          name: formData.name,
          companyName: formData.companyName,
          location: formData.location,
        };
        project = await updateProject(initialData.id, updated);
      }
      if (project) {
        onClose();
      }
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="w-full max-w-xl" closeOnOutsideClick={!isLoading}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b">
          <h2 className="text-xl font-semibold">{mode === 'Create' ? 'New Project' : 'Edit Project'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <TextInput<ProjectFormData>
            label="Project Name"
            field={"name"}
            value={formData.name}
            onChange={(f, v) => handleChange(f, v)}
            placeholder="Enter project name"
            required
          />
          <TextInput<ProjectFormData>
            label="Company Name"
            field={"companyName"}
            value={formData.companyName}
            onChange={(f, v) => handleChange(f, v)}
            placeholder="Enter company name"
          />
          <TextInput<ProjectFormData>
            label="Location"
            field={"location"}
            value={formData.location}
            onChange={(f, v) => handleChange(f, v)}
            placeholder="Enter location"
          />

          {mode === 'Create' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Import Fixture CSV (Required)</label>
                <input
                  id={fixtureInputId}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => handleChange('fixtureCSV', e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <LoadingButton
                    onClick={() => document.getElementById(fixtureInputId)?.click()}
                    variant="primary"
                    className="text-sm"
                  >
                    Choose File
                  </LoadingButton>
                  <span className="text-gray-500 text-sm truncate">
                    {formData.fixtureCSV ? formData.fixtureCSV.name : 'No file chosen'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Import Zone CSV (Required)</label>
                <input
                  id={zoneInputId}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => handleChange('zoneCSV', e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                />
                <div className="flex items-center gap-3">
                  <LoadingButton
                    onClick={() => document.getElementById(zoneInputId)?.click()}
                    variant="primary"
                    className="text-sm"
                  >
                    Choose File
                  </LoadingButton>
                  <span className="text-gray-500 text-sm truncate">
                    {formData.zoneCSV ? formData.zoneCSV.name : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-2 bg-white">
          <LoadingButton onClick={handleClose} variant="secondary">Cancel</LoadingButton>
          <LoadingButton type="submit" variant="primary" isLoading={isLoading}>
            {mode === 'Create' ? 'Create Project' : 'Save'}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;

import React, { useState, useRef } from 'react';
import { projectApi } from '../services/backendApi';



export interface Project {
  id: string;
  name: string;
  company_name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onProjectCreated,
}) => {
  const [formData, setFormData] = useState({
    project_name: '',
    company_name: '',
    location: '',
  });
  const [error, setError] = useState<string | null>(null);

  const fixtureFileRef = useRef<HTMLInputElement>(null);
  const zoneFileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const fixtureFile = fixtureFileRef.current?.files?.[0];
    const zoneFile = zoneFileRef.current?.files?.[0];

    // Validate that both CSV files are provided
    if (!fixtureFile || !zoneFile) {
      setError('Both Fixture CSV and Zone CSV files are required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.project_name);
      formDataToSend.append('company_name', formData.company_name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('fixture_csv', fixtureFile);
      formDataToSend.append('zone_csv', zoneFile);

      await projectApi.createProject(formDataToSend);
      onProjectCreated();
      onClose();
    } catch (error: any) {
      console.error('Failed to create project:', error);
      setError(error.response?.data?.message || 'Failed to create project. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">New Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Project Name
            </label>
            <input
              type="text"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name
            </label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Import Fixture CSV (Required)
            </label>
            <input
              type="file"
              ref={fixtureFileRef}
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Import Zone CSV (Required)
            </label>
            <input
              type="file"
              ref={zoneFileRef}
              accept=".csv"
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-green-50 file:text-green-700
                hover:file:bg-green-100"
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProjectModal; 
import React, { useMemo, useState } from 'react';
import { Modal } from '../common/Modal';
import { TextInput } from '../common/TextInput';
import { LoadingButton } from '../common/LoadingButton';
import { useProject } from '../contexts/ProjectContext';
import { Project } from '../types/project';

interface CloneProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const CloneProjectModal: React.FC<CloneProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { cloneProject } = useProject();
  const defaultName = useMemo(() => (project ? `${project.name} (Copy)` : ''), [project]);
  const [name, setName] = useState<string>(() => defaultName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      setIsLoading(true);
      await cloneProject(project.id, name.trim() || defaultName);
      onClose();
    } catch (err) {
      console.error('Error cloning project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-md" closeOnOutsideClick={!isLoading}>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b">
          <h2 className="text-xl font-semibold">Clone Project</h2>
        </div>
        <div className="p-6">
          <TextInput<{ name: string }>
            label="New Project Name"
            field={"name"}
            value={name}
            onChange={(f, v) => setName(v)}
            placeholder="Enter new project name"
            required
          />
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-2 bg-white">
          <LoadingButton onClick={onClose} variant="secondary">Cancel</LoadingButton>
          <LoadingButton type="submit" variant="primary" isLoading={isLoading}>Clone</LoadingButton>
        </div>
      </form>
    </Modal>
  );
};

export default CloneProjectModal;



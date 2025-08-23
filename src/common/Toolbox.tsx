import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DeviceType } from '../types';
import { configurationApi } from '../services/backendApi';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface DraggableItemProps {
  item: DeviceType;
}

function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`py-1.5 px-3 cursor-move text-sm ${
        isDragging ? 'opacity-50' : ''
      } hover:bg-gray-50 text-gray-700`}
    >
      {item.name}
    </div>
  );
}

interface CategoryGroupProps {
  title: string;
  items: DeviceType[];
  isExpanded: boolean;
  onToggle: () => void;
}

function CategoryGroup({ title, items, isExpanded, onToggle }: CategoryGroupProps) {
  return (
    <div className="mb-1">
      <button
        onClick={onToggle}
        className="flex items-center w-full py-1.5 px-3 text-left text-sm font-medium hover:bg-gray-50"
      >
        {isExpanded ? (
          <ChevronDownIcon className="h-3.5 w-3.5 mr-2 text-gray-500" />
        ) : (
          <ChevronRightIcon className="h-3.5 w-3.5 mr-2 text-gray-500" />
        )}
        {title}
      </button>
      {isExpanded && (
        <div className="ml-4">
          {items.map(device => (
            <DraggableItem key={device.id} item={device} />
          ))}
        </div>
      )}
    </div>
  );
}

const Toolbox: React.FC = () => {
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchDeviceTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: DeviceType[] = await configurationApi.getDeviceTypes();
        setDeviceTypes(response);

        const categories = Array.from(new Set(response.map((device: DeviceType) => device.category || 'Other')));
        const initialExpandedState: Record<string, boolean> = categories.reduce<Record<string, boolean>>((acc, category) => {
          acc[String(category)] = true;
          return acc;
        }, {});
        setExpandedCategories(initialExpandedState);
      } catch (err: any) {
        console.error('Failed to fetch device types:', err);
        setError(err.message || 'Failed to load components');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceTypes();
  }, []);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group device types by category
  const groupedDevices = deviceTypes.reduce((acc, device) => {
    const category = device.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(device);
    return acc;
  }, {} as Record<string, DeviceType[]>);

  if (loading) {
    return (
      <div>
        <div className="px-4 py-3 bg-white border-b">
          <h2 className="text-base font-medium">Tool Box</h2>
        </div>
        <div className="p-4">
          <div className="text-sm text-gray-500">Loading components...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="px-4 py-3 bg-white border-b">
          <h3 className="text-base font-medium">Tool Box</h3>
        </div>
        <div className="p-4">
          <div className="text-sm text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="py-2">
        {Object.entries(groupedDevices).map(([category, items]) => (
          <CategoryGroup
            key={category}
            title={category}
            items={items}
            isExpanded={expandedCategories[category] || false}
            onToggle={() => toggleCategory(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default Toolbox;
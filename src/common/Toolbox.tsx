import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Device, DeviceType } from '../types/configuration';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useConfiguration } from '../contexts/ConfigurationContext';

interface DraggableItemProps {
  item: DeviceType;
}

function DraggableItem({ item }: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    data: item,
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

function CategoryGroup({
  title,
  items,
  isExpanded,
  onToggle,
}: CategoryGroupProps) {
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
          {items.map((device) => (
            <DraggableItem key={device.id} item={device} />
          ))}
        </div>
      )}
    </div>
  );
}

const Toolbox: React.FC = () => {
  const { configuration } = useConfiguration();
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(
    configuration?.deviceTypes.reduce<Record<string, boolean>>(
      (acc, deviceType) => {
        acc[deviceType.name] = true;
        return acc;
      },
      {}
    ) || {}
  );

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Group device types by category
  const groupedDevices = configuration?.deviceTypes.reduce((acc, deviceType) => {
    const category = deviceType.name;
    acc[category] = configuration?.devices.filter(device => device.deviceTypeId === deviceType.id) || [];
    return acc;
  }, {} as Record<string, Device[]>) || {};

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

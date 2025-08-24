import { createContext, useContext, useEffect, useState } from 'react';
import {
  Device,
  DeviceResponse,
  DeviceType,
  DeviceTypeResponse,
  PanelType,
  PanelTypeResponse,
} from '../types/configuration';
import backendApi from '../services/backendApi';
import { ResponseData } from '../types/common';
import { mapDeviceResponseToDevice } from '../utils/configuration-helpers';
import { mapDeviceTypeResponseToDeviceType } from '../utils/configuration-helpers';
import { mapPanelTypeResponseToPanelType } from '../utils/configuration-helpers';
import { useAuth } from './AuthContext';

interface Configuration {
  deviceTypes: DeviceType[];
  panelTypes: PanelType[];
  devices: Device[];
}

interface ConfigurationContextType {
  isLoading: boolean;
  configuration: Configuration | null;
  fetchConfiguration: () => Promise<void>;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchConfiguration();
    }
  }, [isAuthenticated]);

  const fetchConfiguration = async () => {
    setIsLoading(true);
    try {
      const response = await backendApi.get<
        ResponseData<{
          deviceTypes: DeviceTypeResponse[];
          panelTypes: PanelTypeResponse[];
          devices: DeviceResponse[];
        }>
      >('/configurations');

      if(response.data.Data) {
        const { deviceTypes, panelTypes, devices } = response.data.Data;

        const mappedDeviceTypes = deviceTypes.map(
          mapDeviceTypeResponseToDeviceType
        );
        const mappedPanelTypes = panelTypes.map(mapPanelTypeResponseToPanelType);
        const mappedDevices = devices.map(mapDeviceResponseToDevice);

        setConfiguration({
          deviceTypes: mappedDeviceTypes,
          panelTypes: mappedPanelTypes,
          devices: mappedDevices,
        });
      }
      throw new Error('Failed to fetch configuration');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConfigurationContext.Provider
      value={{ isLoading, configuration, fetchConfiguration }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {
  const ctx = useContext(ConfigurationContext);
  if (!ctx) throw new Error('useConfiguration must be used within an ConfigurationProvider');
  return ctx;
};


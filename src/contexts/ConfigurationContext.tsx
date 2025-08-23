import { createContext, useEffect, useState } from 'react';
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
  configuration: Configuration | null;
  fetchConfiguration: () => Promise<void>;
}

const ConfigurationContext = createContext<
  ConfigurationContextType | undefined
>(undefined);

export const ConfigurationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [configuration, setConfiguration] = useState<Configuration | null>(
    null
  );
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    if (isAuthenticated) {
      fetchConfiguration();
    }
  }, [isAuthenticated]);

  const fetchConfiguration = async () => {
    try {
      const response = await backendApi.get<
        ResponseData<{
          deviceTypes: DeviceTypeResponse[];
          panelTypes: PanelTypeResponse[];
          devices: DeviceResponse[];
        }>
      >('/configurations');

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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ConfigurationContext.Provider
      value={{ configuration, fetchConfiguration }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
};

export const useConfiguration = () => {};

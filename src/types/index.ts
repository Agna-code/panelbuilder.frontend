export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  company_name: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export type PanelSize = 'i-RB' | 'i-DRC-S' | 'i-DRC-M' | 'i-DRC-L' | 'i-NETCAB';

export interface Panel {
  id: string;
  project_id: string;
  name: string;
  location: string;
  type: string;
  panel_type_id: string;
  total_spaces: number;
  device_type?: 'cabinet' | 'roombox';
  config?: PanelConfig;
  created_at?: string;
  updated_at?: string;
}

export interface Component {
  id: string;
  panel_id: string;
  type: string;
  properties: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ComponentPosition extends DeviceType {
  slot: number;
  ru_spaces: number;
  din_spaces: number;
  ma_draw: number;
  is_din_rail_provider: boolean;
  requires_din_rail: boolean;
  mounted_on?: string;
  nested_components: ComponentPosition[];
}

export interface Fixture {
  id: string;
  project_id: string;
  name: string;
  type: string;
  location: string;
  zone_id: string | null;
  address: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Zone {
  id: string;
  project_id: string;
  name: string;
  type: string;
  location: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceType {
  id: string;
  name: string;
  description: string;
  category: string;
  ru_spaces?: number;
  din_spaces?: number;
  din_spaces_provided?: number;
  ma_draw?: number;
  max_per_panel?: number;
  is_din_rail_provider: boolean;
  requires_din_rail: boolean;
  is_power_supply: boolean;
  used_with?: string;
  note?: string;
}

export interface PanelType {
  id: string;
  name: string;
  total_spaces: number;
  device_type: 'cabinet' | 'roombox';
  din_spaces_provided?: number;
}

export interface PowerSupply extends PanelComponent {
  is_primary: boolean;
  power_available: number;
}

export interface PanelComponent {
  id: string;
  type: string;
  name: string;
  description: string;
  slot: number;
  ru_spaces?: number;
  din_spaces?: number;
  ma_draw?: number;
  is_din_rail_provider?: boolean;
  requires_din_rail?: boolean;
  is_power_supply?: boolean;
  din_spaces_provided?: number;
  mounted_on?: string;
  din_rail_position?: number;
  nested_components: PanelComponent[];
  x?: number;
  y?: number;
  width?: number | null;
  height?: number;
  isSpanSlot?: boolean; // Marks if this is a span slot for multi-RU components
  parentSlot?: number; // Points to the parent slot for span slots
  spanStart?: number; // Starting slot number for multi-RU components
  spanEnd?: number; // Ending slot number for multi-RU components
  isHidden?: boolean; // Whether this component should be hidden in the UI (for span slots)
  railNumber?: number; // The actual rail number where the component is placed
  isBeingMoved?: boolean; // Whether the component is currently being dragged
}

export interface PanelConfig {
  components: PanelComponent[];
  total_power_draw?: number;
  available_din_spaces?: number;
  used_din_spaces?: number;
  power_supplies?: PanelComponent[];
  din_rail_providers?: PanelComponent[];
}

export interface PDBLink {
  source_id: number;
  target_id: number;
  link_type: 'data' | 'data_power';
}

export type ComponentType = 
  | 'i-DRC-RH' 
  | 'i-DRC-RTK' 
  | 'i-DRC-V1' 
  | 'i-DRC-V2' 
  | 'i-DRC-VC3' 
  | 'i-DRC-SC3'
  | 'i-PS18'
  | 'i-PDB350'
  | 'i-1Z010RLY'
  | 'i-1ZPHD';

export interface ComponentConfig {
  power_draw?: number;
  zone_assignments?: string[];
  is_primary?: boolean;
  linked_components?: number[];
}

export interface ComponentSpecs {
  type: ComponentType;
  name: string;
  spaces: number;
  power_draw: number;
  description: string;
}

export interface DragItem {
  type: string;
  component: ComponentType;
  id: string;
}

export interface ValidationError {
  type: 'space' | 'power' | 'component_limit' | 'mounting' | 'save';
  message: string;
  component?: string;
}

export interface ToolboxItem {
  id: string;
  name: string;
  type: string;
  size: number;
}

export interface PanelLayout {
  panelId: string;
  components: ComponentPosition[];
}

export interface RouteParams extends Record<string, string | undefined> {
  projectId: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  stats: {
    power_draw: number;
    din_space: {
      required: number;
      provided: number;
    };
    ru_space: {
      required: number;
      provided: number;
    };
  };
}

export interface PanelSlot {
  id: string;
  component: PanelComponent | null;
  nestedComponents: PanelComponent[];
  isSpanSlot?: boolean; // Whether this slot is part of a multi-RU component span
  parentSlot?: number; // Reference to the parent slot if this is a span slot
  railNumber: number; // The actual rail number for this slot
} 

export interface RailStats {
  railNumber: number;
  railRange?: string;  // Made optional
  components: PanelComponent[];
  dinSpaceUsage?: {
    required: number;
    provided: number;
  };
  powerDraw: number;
  isSpanRail?: boolean;
  ruSpaces?: number;
}

export interface UsageStats {
  power_draw: number;
  din_space: {
    required: number;
    provided: number;
  };
  rails: RailStats[];
  panelType: string;
  totalSpaces: number;
}
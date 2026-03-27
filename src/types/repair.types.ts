export interface RepairPartRequest {
  partId: number;
  quantity: number;
}

export interface InternalRepairRequest {
  phoneId: number;
  parts: RepairPartRequest[];
  laborCost?: number;
  laborDescription?: string;
  notes?: string;
}

export interface RepairPartResponse {
  partName: string;
  quantity: number;
  partCost: number;
}

export interface InternalRepairResponse {
  id: number;
  phoneName: string;
  totalPartsCost: number;
  laborCost: number;
  totalSessionCost: number;
  laborDescription: string;
  notes: string;
  parts: RepairPartResponse[];
}

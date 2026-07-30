export type FBARole =
  | 'ADMIN'
  | 'WAREHOUSE_MANAGER'
  | 'PICKER'
  | 'PACKER'
  | 'INVENTORY_CONTROLLER'
  | 'QUALITY_INSPECTOR'
  | 'SHIPPING_COORDINATOR'
  | 'SELLER';

export type WarehouseStatus = 'ACTIVE' | 'MAINTENANCE' | 'DISABLED' | 'FULL_CAPACITY';

export type TempZone = 'AMBIENT' | 'CLIMATE_CONTROLLED' | 'REFRIGERATED' | 'FROZEN' | 'HAZMAT';

export interface FBAWarehouse {
  id: string;
  name: string;
  code: string; // e.g. EWR4, ONT8, BFI4
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalCapacityCubicMeters: number;
  usedCapacityCubicMeters: number;
  temperatureZone: TempZone;
  staffCount: number;
  operatingHours: string;
  status: WarehouseStatus;
  utilizationPct: number;
  activeRacksCount: number;
  activeBinsCount: number;
}

export type ConditionGrade = 'NEW' | 'LIKE_NEW' | 'OPEN_BOX' | 'DAMAGED' | 'DISPOSAL_REQUIRED';

export type RotationStrategy = 'FIFO' | 'LIFO' | 'FEFO';

export interface FBAInventoryItem {
  id: string;
  sellerId: string;
  sellerName: string;
  fnsku: string; // FBA Stock Keeping Unit e.g. X002891A
  asin: string;
  sku: string;
  productTitle: string;
  warehouseId: string;
  warehouseCode: string;
  shelf: string;
  rack: string;
  bin: string;
  quantityOnHand: number;
  quantityReserved: number;
  quantityAvailable: number;
  quantityInbound: number;
  batchNumber: string;
  serialNumber?: string;
  expiryDate?: string; // ISO date string
  condition: ConditionGrade;
  rotationStrategy: RotationStrategy;
  unitVolumeCubicMeters: number;
  unitWeightKg: number;
  dailyStorageFeeUSD: number;
  lastAuditedAt: string;
}

export type InboundShipmentStatus =
  | 'SHIPMENT_CREATED'
  | 'APPROVED_BY_FBA'
  | 'IN_TRANSIT'
  | 'DELIVERED_TO_DOCK'
  | 'INSPECTING'
  | 'BARCODE_VERIFIED'
  | 'STORED_AVAILABLE';

export type FBAInboundShipmentStatus = InboundShipmentStatus;

export interface FBAInboundShipment {
  shipmentId: string; // e.g. FBA-INB-9901
  sellerId: string;
  sellerName: string;
  targetWarehouseId: string;
  targetWarehouseCode: string;
  items: {
    sku: string;
    asin: string;
    fnsku: string;
    productTitle: string;
    declaredQty: number;
    receivedQty: number;
    passedQty: number;
    failedQty: number;
  }[];
  totalUnits: number;
  carrier: string;
  trackingNumber: string;
  status: InboundShipmentStatus;
  arrivalDate: string;
  shelfAssigned?: string;
  binAssigned?: string;
  inspectionNotes?: string;
  createdAt: string;
}

export type TransferType = 'WAREHOUSE_TO_WAREHOUSE' | 'BIN_TO_BIN' | 'SHELF_TO_SHELF' | 'INTERNAL_REBALANCING';

export interface FBAInventoryTransfer {
  transferId: string; // e.g. TRF-8801
  transferType: TransferType;
  fnsku: string;
  productTitle: string;
  quantity: number;
  sourceWarehouseCode: string;
  sourceLocation: string; // Shelf-Rack-Bin
  destWarehouseCode: string;
  destLocation: string;
  status: 'INITIATED' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  initiatedBy: string;
  timestamp: string;
}

export type PickingStrategy = 'SINGLE_ORDER' | 'BATCH_PICKING' | 'WAVE_PICKING' | 'ZONE_PICKING';

export interface FBAPickingTask {
  taskId: string; // e.g. PCK-7701
  pickingStrategy: PickingStrategy;
  pickerId: string;
  pickerName: string;
  warehouseCode: string;
  items: {
    fnsku: string;
    productTitle: string;
    location: string;
    qtyRequired: number;
    qtyPicked: number;
    isPicked: boolean;
  }[];
  totalItemsCount: number;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'VERIFICATION_REQUIRED';
  startedAt: string;
  completedAt?: string;
}

export type BoxType = 'SMALL_BOX_A' | 'MEDIUM_BOX_B' | 'LARGE_BOX_C' | 'HEAVY_CUSTOM_PALLET';

export interface FBAPackingTask {
  packId: string; // e.g. PAK-5501
  orderId: string;
  warehouseCode: string;
  packerName: string;
  selectedBox: BoxType;
  actualWeightKg: number;
  expectedWeightKg: number;
  weightVerified: boolean;
  packingSlipGenerated: boolean;
  labelPrinted: boolean;
  status: 'PENDING' | 'VERIFYING_WEIGHT' | 'PACKED_LABELED' | 'DISPATCH_READY';
  timestamp: string;
}

export type FBACarrier = 'COMMERCE_ZON_LOGISTICS_PRIME' | 'FEDEX_EXPRESS' | 'UPS_WORLDWIDE' | 'DHL_EXPRESS';

export type FBAOrderStatus =
  | 'ORDER_RECEIVED'
  | 'INVENTORY_RESERVED'
  | 'PICKING_ACTIVE'
  | 'PACKING_ACTIVE'
  | 'LABEL_GENERATED'
  | 'CARRIER_PICKUP'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'RETURNED';

export interface FBACustomerOrder {
  orderId: string; // e.g. FBA-ORD-10901
  buyerName: string;
  buyerAddress: string;
  sellerId: string;
  sellerName: string;
  warehouseCode: string;
  items: {
    fnsku: string;
    sku: string;
    productTitle: string;
    qty: number;
    priceUSD: number;
  }[];
  subtotalUSD: number;
  fulfilmentFeeUSD: number;
  shippingFeeUSD: number;
  totalUSD: number;
  carrier: FBACarrier;
  trackingNumber: string;
  status: FBAOrderStatus;
  estimatedDelivery: string;
  timeline: {
    status: FBAOrderStatus;
    description: string;
    timestamp: string;
  }[];
  createdAt: string;
}

export interface FBAFeeRecord {
  feeId: string; // e.g. FEE-3301
  sellerId: string;
  sellerName: string;
  feeType: 'DAILY_STORAGE' | 'LONG_TERM_STORAGE' | 'PICK_PACK_FULFILMENT' | 'OVERSIZED_HANDLING' | 'RETURN_INSPECTION';
  amountUSD: number;
  description: string;
  deductedFromWallet: boolean;
  timestamp: string;
}

export type FBAReturnAction = 'RESTOCK_GRADE_A' | 'DISPOSAL_DESTRUCTION' | 'REPLACEMENT_SENT' | 'RETURN_TO_SELLER';

export interface FBAReturnRecord {
  rmaId: string; // e.g. FBA-RMA-401
  orderId: string;
  buyerName: string;
  fnsku: string;
  productTitle: string;
  returnReason: string;
  inspectionGrade: ConditionGrade;
  actionTaken: FBAReturnAction;
  refundAmountUSD: number;
  warehouseCode: string;
  inspectorName: string;
  status: 'RECEIVED' | 'INSPECTED' | 'RESTOCKED' | 'REFUNDED';
  timestamp: string;
}

export interface FBAAuditRecord {
  auditId: string; // e.g. AUD-201
  warehouseCode: string;
  auditorName: string;
  fnsku: string;
  expectedQty: number;
  actualPhysicalQty: number;
  varianceQty: number;
  varianceReason: 'LOST_IN_WAREHOUSE' | 'DAMAGED_IN_HANDLING' | 'MISCOUNT' | 'SYSTEM_RECONCILED';
  status: 'PENDING_APPROVAL' | 'APPROVED_ADJUSTED' | 'REJECTED';
  timestamp: string;
}

export interface FBAStaffMember {
  staffId: string;
  name: string;
  email: string;
  role: FBARole;
  assignedWarehouseCode: string;
  pickingAccuracyPct: number;
  packingAccuracyPct: number;
  shiftHours: string;
  status: 'ACTIVE_ON_SHIFT' | 'OFF_DUTY' | 'ON_LEAVE';
}

export interface FBANotification {
  id: string;
  title: string;
  message: string;
  type: 'INVENTORY_RECEIVED' | 'LOW_STOCK' | 'SHIPMENT_DISPATCHED' | 'FEE_CHARGED' | 'SECURITY_ALERT';
  channel: 'IN_APP' | 'EMAIL' | 'SMS' | 'PUSH';
  recipient: string;
  timestamp: string;
  isRead: boolean;
}

export interface FBAEnrollmentRequest {
  sellerId: string;
  sellerName: string;
  businessName: string;
  taxId: string;
  termsAccepted: boolean;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
  monthlyVolumeEstUnits: number;
  appliedAt: string;
}

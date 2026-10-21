import { Order } from '../../types/domain';
import {
  ComprehensiveMasterOrder,
  OrderLifecycleStatus,
  ReturnRequestRecord,
  RefundRecord,
  SellerSettlementRecord,
} from '../../types/oms';

export interface OrderSearchFilter {
  query?: string;
  status?: OrderLifecycleStatus | 'ALL';
  sellerId?: string;
  customerId?: string;
  warehouseId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface IOrderRepository {
  // Legacy / Basic Order Methods
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  findByCustomer(customerId: string): Promise<Order[]>;
  create(order: Omit<Order, 'id'>): Promise<Order>;
  updateStatus(id: string, status: Order['status']): Promise<Order | null>;

  // Enterprise OMS Methods
  findAllOMSOrders(filter?: OrderSearchFilter): Promise<ComprehensiveMasterOrder[]>;
  findOMSOrderById(id: string): Promise<ComprehensiveMasterOrder | null>;
  createOMSOrder(orderData: Partial<ComprehensiveMasterOrder>): Promise<ComprehensiveMasterOrder>;
  updateOMSOrderStatus(
    orderId: string,
    status: OrderLifecycleStatus,
    actorName?: string,
    actorRole?: string,
    note?: string
  ): Promise<ComprehensiveMasterOrder | null>;
  addOMSOrderNote(orderId: string, note: string, author: string): Promise<ComprehensiveMasterOrder | null>;
  
  // Returns & Refunds
  findAllReturns(): Promise<ReturnRequestRecord[]>;
  createReturnRequest(returnReq: ReturnRequestRecord): Promise<ReturnRequestRecord>;
  updateReturnStatus(returnId: string, status: ReturnRequestRecord['status'], note?: string): Promise<ReturnRequestRecord | null>;
  
  findAllRefunds(): Promise<RefundRecord[]>;
  createRefundRecord(refund: RefundRecord): Promise<RefundRecord>;

  findAllSettlements(): Promise<SellerSettlementRecord[]>;
}

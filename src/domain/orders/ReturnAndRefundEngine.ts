/**
 * Enterprise Order Management System (OMS)
 * Return Management (RMA) & Multi-Channel Refund Engine
 */

import { Money } from '../../types/domain';
import {
  ComprehensiveMasterOrder,
  ReturnRequestRecord,
  RefundRecord,
  SellerSettlementRecord,
} from '../../types/oms';
import { OrderNumberGenerator } from './OrderNumberGenerator';
import { logger } from '../../infrastructure/logging/Logger';

export class ReturnAndRefundEngine {
  /**
   * Processes a new Return Request (RMA) from a customer.
   */
  public static createReturnRequest(payload: {
    order: ComprehensiveMasterOrder;
    subOrderId?: string;
    productId: string;
    reason: string;
    comment: string;
    mediaUrls?: string[];
    refundMethod?: 'WALLET' | 'ORIGINAL_PAYMENT_METHOD' | 'STORE_CREDIT';
  }): ReturnRequestRecord {
    const { order, subOrderId, productId, reason, comment, mediaUrls, refundMethod } = payload;

    const item = order.items.find((i) => i.productId === productId) || order.items[0];

    const refundAmount: Money = item
      ? { amount: item.totalPrice.amount, currency: item.totalPrice.currency }
      : { amount: order.grandTotal.amount, currency: order.grandTotal.currency };

    const returnRecord: ReturnRequestRecord = {
      id: OrderNumberGenerator.generateRMANumber(),
      orderId: order.id,
      subOrderId,
      customerId: order.customerId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      productId: item ? item.productId : productId,
      productTitle: item ? item.productTitle : 'Returned Item',
      reason,
      comment,
      mediaUrls: mediaUrls || [],
      refundMethod: refundMethod || 'WALLET',
      status: 'REQUESTED',
      requestedAt: new Date().toISOString(),
      refundAmount,
    };

    logger.audit(
      `Return request ${returnRecord.id} generated for Order ${order.orderNumber} (Reason: ${reason}).`,
      'OMS_Returns'
    );

    return returnRecord;
  }

  /**
   * Processes a refund execution on an approved return or direct cancellation.
   */
  public static executeRefund(payload: {
    order: ComprehensiveMasterOrder;
    subOrderId?: string;
    refundType: 'FULL' | 'PARTIAL' | 'WALLET' | 'ORIGINAL_CARD' | 'STORE_CREDIT';
    amount: Money;
    reason: string;
    sellerId?: string;
    buyerWalletBalanceCurrent: number;
  }): { refundRecord: RefundRecord; updatedWalletBalance: number } {
    const { order, subOrderId, refundType, amount, reason, sellerId, buyerWalletBalanceCurrent } = payload;

    const refundId = OrderNumberGenerator.generateRefundNumber();
    const isWallet = refundType === 'WALLET' || refundType === 'FULL';
    const updatedWalletBalance = isWallet ? buyerWalletBalanceCurrent + amount.amount : buyerWalletBalanceCurrent;

    const refundRecord: RefundRecord = {
      id: refundId,
      orderId: order.id,
      subOrderId,
      customerId: order.customerId,
      sellerId: sellerId || (order.items[0] ? order.items[0].merchantId : 'merch-01'),
      refundType,
      amount,
      reason,
      status: 'PROCESSED',
      buyerWalletCredited: isWallet,
      sellerWalletDebited: true,
      marketplaceFeeAdjusted: true,
      processedAt: new Date().toISOString(),
    };

    logger.audit(
      `Refund ${refundId} executed for Order ${order.orderNumber} ($${amount.amount} via ${refundType}).`,
      'OMS_Refunds'
    );

    return { refundRecord, updatedWalletBalance };
  }
}

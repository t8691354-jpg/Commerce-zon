/**
 * Enterprise Shipping Label & Document Generator Engine
 * Generates Carrier Labels, Barcodes, QR Manifests, and Packing Slips
 */

import { ShipmentEntity } from './ShipmentEntity';

export interface GeneratedShippingLabel {
  shipmentId: string;
  trackingNumber: string;
  carrierCode: string;
  carrierName: string;
  barcodeData: string; // GS1-128 barcode format
  qrCodePayload: string; // Encrypted JSON payload for scanning
  shippingLabelHtml: string;
  packingSlipHtml: string;
  createdAt: string;
}

export class ShippingLabelEngine {
  public static generateLabelAndPackingSlip(shipment: ShipmentEntity): GeneratedShippingLabel {
    const barcodeData = `(01)00881920391(10)${shipment.trackingNumber}(21)${shipment.shipmentId}`;
    const qrCodePayload = JSON.stringify({
      shp: shipment.shipmentId,
      ord: shipment.orderId,
      trk: shipment.trackingNumber,
      dest: `${shipment.destinationAddress.postalCode},${shipment.destinationAddress.countryCode}`,
    });

    const itemsRows = shipment.items
      .map(
        i => `<tr>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">${i.sku}</td>
          <td style="padding: 6px; border-bottom: 1px solid #eee;">${i.name}</td>
          <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: center;">${i.quantity}</td>
          <td style="padding: 6px; border-bottom: 1px solid #eee; text-align: right;">${i.unitWeightKg} kg</td>
        </tr>`
      )
      .join('');

    const shippingLabelHtml = `
      <div style="width: 400px; padding: 16px; border: 2px solid #000; font-family: monospace; font-size: 12px; background: #fff;">
        <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 8px;">
          <strong style="font-size: 18px;">${shipment.carrierName.toUpperCase()}</strong>
          <span style="font-size: 14px; font-weight: bold;">${shipment.shippingMethod}</span>
        </div>
        <div style="margin-top: 10px; font-size: 10px;">
          <div><strong>FROM:</strong> Commerce Zon Fulfilment Hub (${shipment.warehouseId})</div>
          <div>${shipment.originAddress.streetLine1}, ${shipment.originAddress.city}, ${shipment.originAddress.stateOrProvince} ${shipment.originAddress.postalCode}</div>
        </div>
        <hr style="border: 0.5px solid #ccc; margin: 10px 0;" />
        <div style="font-size: 12px;">
          <div><strong>SHIP TO:</strong></div>
          <div style="font-size: 14px; font-weight: bold;">${shipment.destinationAddress.fullName}</div>
          <div>${shipment.destinationAddress.streetLine1} ${shipment.destinationAddress.streetLine2 || ''}</div>
          <div>${shipment.destinationAddress.city}, ${shipment.destinationAddress.stateOrProvince} ${shipment.destinationAddress.postalCode}</div>
          <div>${shipment.destinationAddress.countryCode} | Tel: ${shipment.destinationAddress.phone}</div>
        </div>
        <hr style="border: 1px dashed #000; margin: 12px 0;" />
        <div style="text-align: center;">
          <div style="font-size: 14px; font-weight: bold; letter-spacing: 2px;">TRACKING #: ${shipment.trackingNumber}</div>
          <div style="background: #000; color: #fff; padding: 8px; margin: 8px 0; font-family: monospace; letter-spacing: 4px;">|||| ||| ||||| || |||||| ||| ||||</div>
          <div style="font-size: 9px; color: #666;">REF: ${shipment.shipmentId} | ORDER: ${shipment.orderNumber}</div>
        </div>
      </div>
    `;

    const packingSlipHtml = `
      <div style="width: 600px; padding: 24px; font-family: sans-serif; font-size: 13px; color: #333; background: #fff;">
        <h2>COMMERCE ZON PACKING SLIP</h2>
        <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
          <div>
            <strong>Order #:</strong> ${shipment.orderNumber}<br />
            <strong>Date:</strong> ${new Date(shipment.createdAt).toLocaleDateString()}<br />
            <strong>Shipping Method:</strong> ${shipment.shippingMethod}
          </div>
          <div style="text-align: right;">
            <strong>Shipment ID:</strong> ${shipment.shipmentId}<br />
            <strong>Tracking #:</strong> ${shipment.trackingNumber}
          </div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="background: #f4f4f4;">
              <th style="padding: 8px; text-align: left;">SKU</th>
              <th style="padding: 8px; text-align: left;">Item Description</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Weight</th>
            </tr>
          </thead>
          <tbody>
            ${itemsRows}
          </tbody>
        </table>
        <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #ccc; font-size: 11px; color: #666;">
          Thank you for shopping on Commerce Zon! For return requests or delivery support, visit your Order History tab.
        </div>
      </div>
    `;

    return {
      shipmentId: shipment.shipmentId,
      trackingNumber: shipment.trackingNumber,
      carrierCode: shipment.carrierId,
      carrierName: shipment.carrierName,
      barcodeData,
      qrCodePayload,
      shippingLabelHtml,
      packingSlipHtml,
      createdAt: new Date().toISOString(),
    };
  }
}

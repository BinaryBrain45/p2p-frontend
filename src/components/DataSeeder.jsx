import React from 'react';
import { createPO, createGRN, createInvoice } from '../services/api';

const DataSeeder = ({ onDataGenerated }) => {

  // SCENARIO 1: PERFECT MATCH
  const generatePerfectMatch = async () => {
    const id = Math.floor(Math.random() * 1000); // Random ID to avoid duplicates
    const poNum = `PO-MATCH-${id}`;
    
    try {
      // 1. Create Purchase Order (The Truth)
      await createPO({
        poNumber: poNum,
        vendorId: "DELL_COMPUTERS",
        itemCode: "LAPTOP-X1",
        orderedQty: 10,
        unitPrice: 1000.00,
        poStatus: "OPEN"
      });

      // 2. Create Goods Receipt (The Reality - We received exactly 10)
      await createGRN({
        grnNumber: `GRN-${id}`,
        poNumber: poNum,
        receivedQty: 10,
        receiptDate: "2023-10-25"
      });

      // 3. Create Invoice (The Ask - Billing for 10 at correct price)
      await createInvoice({
        invoiceNumber: `INV-${id}`,
        poNumber: poNum,
        billedQty: 10,
        billedAmount: 10000.00, // 10 * 1000
        invoiceDate: "2023-10-26"
      });

      alert("✅ Perfect Match Scenario Created!");
      onDataGenerated(); // Refresh the table
    } catch (error) {
      console.error(error);
      alert("Error creating data. Check console.");
    }
  };

  // SCENARIO 2: MISMATCH (Qty Mismatch)
  const generateMismatch = async () => {
    const id = Math.floor(Math.random() * 1000);
    const poNum = `PO-FAIL-${id}`;

    try {
      // 1. Order 10 items
      await createPO({
        poNumber: poNum,
        vendorId: "HP_INC",
        itemCode: "PRINTER-Z5",
        orderedQty: 10,
        unitPrice: 200.00,
        poStatus: "OPEN"
      });

      // 2. Receive only 5 items (Shortage)
      await createGRN({
        grnNumber: `GRN-${id}`,
        poNumber: poNum,
        receivedQty: 5,
        receiptDate: "2023-10-25"
      });

      // 3. Vendor bills us for all 10 (FRAUD/ERROR!)
      await createInvoice({
        invoiceNumber: `INV-BAD-${id}`,
        poNumber: poNum,
        billedQty: 10,
        billedAmount: 2000.00, 
        invoiceDate: "2023-10-26"
      });

      alert("⚠️ Mismatch Scenario Created!");
      onDataGenerated();
    } catch (error) {
      console.error(error);
      alert("Error creating data.");
    }
  };

  return (
    <div className="card mb-4 bg-light">
      <div className="card-body d-flex justify-content-between align-items-center">
        <h5 className="m-0">⚡ Demo Tools:</h5>
        <div>
            <button className="btn btn-success me-2" onClick={generatePerfectMatch}>
                + Generate Perfect Match
            </button>
            <button className="btn btn-danger" onClick={generateMismatch}>
                + Generate Mismatch
            </button>
        </div>
      </div>
    </div>
  );
};

export default DataSeeder;
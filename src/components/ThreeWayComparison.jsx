import React, { useState, useEffect } from 'react';

const ThreeWayComparison = ({ invoice, po, grn, onMatch }) => {
  // NEW: State for the "Simulation" buttons
  const [manualStatus, setManualStatus] = useState(null); // null, 'APPROVED', 'REJECTED'

  // Reset the status whenever a new invoice is selected
  useEffect(() => {
    setManualStatus(null);
  }, [invoice]);

  // If data is missing, show a loading state
  if (!invoice || !po) return <div className="text-muted">Waiting for selection...</div>;

  // 1. CALCULATE EXPECTED VALUES
  const expectedTotal = invoice.billedQty * po.unitPrice;
  const actualTotal = invoice.billedAmount;
  const difference = Math.abs(expectedTotal - actualTotal);

  // 2. DEFINE TOLERANCE RULES (Dual Threshold)
  const percentageLimit = expectedTotal * 0.02; // 2% Rule
  const flatCap = 50.00;                        // $50 Cap Rule
  
  // The allowable limit is whichever is SMALLER
  const activeToleranceLimit = Math.min(percentageLimit, flatCap);

  // 3. DETERMINE PRICE MATCH STATUS
  const isPerfectPrice = difference === 0;
  const isTolerancePrice = difference > 0 && difference <= activeToleranceLimit;
  const isPriceMatch = isPerfectPrice || isTolerancePrice;

  // 4. QUANTITY CHECK
  const receivedQty = grn ? grn.receivedQty : 0;
  const isQtyMatch = invoice.billedQty <= receivedQty;

  // 5. OVERALL STATUS
  const isOverallMatch = isPriceMatch && isQtyMatch;

  // --- NEW: HANDLE BUTTON CLICKS ---
  const handleDecision = (decision) => {
    // 1. Show alert (Simulation)
    alert(`SIMULATION: Invoice #${invoice.invoiceNumber} has been ${decision}. \n(In a real app, this would update the ERP database).`);
    
    // 2. Update UI State
    setManualStatus(decision);
  };

  return (
    <div className="card shadow-sm p-4 mb-4 bg-white">
      <h3 className="mb-4 text-dark">3-Way Match Analysis</h3>

      <div className="row text-center">
        {/* --- COLUMN 1: PURCHASE ORDER --- */}
        <div className="col-md-4">
          <div className="card border-primary bg-white text-dark">
            <div className="card-header bg-primary text-white">Purchase Order (PO)</div>
            <div className="card-body">
              <h5>#{po.poNumber}</h5>
              <p>Ordered Qty: <strong>{po.orderedQty}</strong></p>
              <p>Unit Price: <strong>${po.unitPrice}</strong></p>
              <p className="text-muted small">Expected Total: ${expectedTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* --- COLUMN 2: GOODS RECEIPT --- */}
        <div className="col-md-4">
          <div className={`card ${grn ? 'border-success' : 'border-warning'} bg-white text-dark`}>
            <div className={`card-header ${grn ? 'bg-success' : 'bg-warning'} text-white`}>
              Goods Receipt (GRN)
            </div>
            <div className="card-body">
              {grn ? (
                <>
                  <h5>#{grn.grnNumber}</h5>
                  <p>Received Qty: <strong>{grn.receivedQty}</strong></p>
                  <p>Date: {grn.receiptDate}</p>
                </>
              ) : (
                <p className="text-danger">No Goods Receipt Found!</p>
              )}
            </div>
          </div>
        </div>

        {/* --- COLUMN 3: INVOICE --- */}
        <div className="col-md-4">
          <div className="card border-info bg-white text-dark">
            <div className="card-header bg-info text-white">Vendor Invoice</div>
            <div className="card-body">
              <h5>#{invoice.invoiceNumber}</h5>
              
              {/* QTY STATUS */}
              <p className={isQtyMatch ? "text-success" : "text-danger fw-bold"}>
                Billed Qty: {invoice.billedQty} 
                {!isQtyMatch && " ❌ (Shortage)"}
              </p>
              
              <p>Total Amount: <strong>${invoice.billedAmount}</strong></p>

              {/* PRICE MATCH STATUS BADGES */}
              <div className="mt-2">
                {isPerfectPrice && (
                    <span className="badge bg-success">Price: Perfect Match</span>
                )}
                
                {isTolerancePrice && (
                    <span className="badge bg-warning text-dark">
                        Price: Within Tolerance (${difference.toFixed(2)})
                    </span>
                )}
                
                {!isPriceMatch && (
                    <div className="d-flex flex-column align-items-center">
                        <span className="badge bg-danger mb-1">Price Mismatch</span>
                        <small className="text-danger" style={{fontSize: '0.8rem'}}>
                            Diff: ${difference.toFixed(2)} &gt; Limit: ${activeToleranceLimit.toFixed(2)}
                        </small>
                    </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION AREA (UPDATED) --- */}
      <div className="mt-4 text-center border-top pt-4">
        
        {/* If user hasn't decided yet, show the Analysis Result */}
        {!manualStatus && (
            <>
                {isOverallMatch ? (
                    <div className={`alert ${isPerfectPrice ? 'alert-success' : 'alert-warning'}`}>
                        {isPerfectPrice 
                            ? "✅ SYSTEM MATCH: Ready for Payment" 
                            : "⚠️ SYSTEM MATCH (TOLERANCE): Auto-Approved by Rules."}
                    </div>
                ) : (
                    <div className="alert alert-danger">
                        🛑 <strong>SYSTEM BLOCK:</strong> Discrepancy Detected. Manager Approval Required.
                    </div>
                )}
            </>
        )}

        {/* --- THE NEW BUTTONS --- */}
        <div className="d-flex justify-content-center gap-3 mt-3">
            
            {/* Show Buttons only if no decision made yet */}
            {!manualStatus && (
                <>
                    <button 
                        className="btn btn-success btn-lg px-4"
                        onClick={() => handleDecision('APPROVED')}
                    >
                        ✅ Approve Payment
                    </button>

                    <button 
                        className="btn btn-danger btn-lg px-4"
                        style={{ marginLeft: '15px' }} // Spacing
                        onClick={() => handleDecision('REJECTED')}
                    >
                        ❌ Decline Invoice
                    </button>
                </>
            )}

            {/* Show Result Badge after decision */}
            {manualStatus === 'APPROVED' && (
                <div className="alert alert-success w-100">
                    <h3>✅ INVOICE APPROVED</h3>
                    <p>Payment scheduled for processing.</p>
                </div>
            )}

            {/* Show Result Badge after decision */}
            {manualStatus === 'REJECTED' && (
                <div className="alert alert-danger w-100">
                    <h3>❌ INVOICE REJECTED</h3>
                    <p>Vendor has been notified of the discrepancy.</p>
                </div>
            )}

        </div>

        {/* Keep the backend button as a 'Debug' option at the very bottom */}
        {!manualStatus && (
             <button 
                className="btn btn-outline-secondary btn-sm mt-4"
                onClick={() => onMatch(invoice.invoiceNumber)}
            >
                (Debug) Run Backend Verification
            </button>
        )}

      </div>
    </div>
  );
};

export default ThreeWayComparison;
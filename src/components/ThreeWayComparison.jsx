import React from 'react';

const ThreeWayComparison = ({ invoice, po, grn, onMatch }) => {
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
  // Note: Usually invoice qty should be <= received qty. 
  // If invoice bills for 10 but we received 5, that is a block.
  const isQtyMatch = invoice.billedQty <= receivedQty;

  // 5. OVERALL STATUS
  const isOverallMatch = isPriceMatch && isQtyMatch;

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

      {/* --- ACTION AREA --- */}
      <div className="mt-4 text-center">
        {isOverallMatch ? (
          <div className={`alert ${isPerfectPrice ? 'alert-success' : 'alert-warning'}`}>
            {isPerfectPrice 
                ? "✅ MATCH SUCCESSFUL: Ready for Payment" 
                : "⚠️ MATCH APPROVED (TOLERANCE): Small variance detected but auto-approved."}
          </div>
        ) : (
          <div className="alert alert-danger">
            🛑 <strong>MATCH FAILED:</strong> Payment Blocked
          </div>
        )}
        
        <button 
            className="btn btn-dark btn-lg"
            onClick={() => onMatch(invoice.invoiceNumber)}
        >
            Run Backend Verification
        </button>
      </div>
    </div>
  );
};

export default ThreeWayComparison;
import React, { useState, useEffect } from 'react';

const ThreeWayComparison = ({ invoice, po, grn, onMatch, onProcessComplete }) => {
  const [manualStatus, setManualStatus] = useState(null); // null, 'APPROVED', 'REJECTED'

  useEffect(() => {
    setManualStatus(null);
  }, [invoice]);

  if (!invoice || !po) return null;

  // --- LOGIC CALCULATIONS ---
  const expectedTotal = invoice.billedQty * po.unitPrice;
  const actualTotal = invoice.billedAmount;
  const difference = Math.abs(expectedTotal - actualTotal);
  
  // Tolerance Rules
  const percentageLimit = expectedTotal * 0.02; 
  const flatCap = 50.00;                        
  const activeToleranceLimit = Math.min(percentageLimit, flatCap);
  
  const isPerfectPrice = difference === 0;
  const isTolerancePrice = difference > 0 && difference <= activeToleranceLimit;
  const isPriceMatch = isPerfectPrice || isTolerancePrice;

  const receivedQty = grn ? grn.receivedQty : 0;
  const isQtyMatch = invoice.billedQty <= receivedQty;
  const isOverallMatch = isPriceMatch && isQtyMatch;

  // --- HANDLE DECISION ---
  const handleDecision = (decision) => {
    // 1. Show the Toast Notification
    setManualStatus(decision);

    // 2. Wait 2 seconds, then close the window and remove from list
    setTimeout(() => {
        onProcessComplete(invoice.invoiceNumber);
    }, 2000); 
  };

  return (
    // Added 'bg-white' explicitly to prevent dark mode issues
    <div className="card shadow-lg p-4 mb-5 bg-white border-0 position-relative">
      
      {/* HEADER + CLOSE BUTTON */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-dark m-0">3-Way Match Analysis</h3>
        <button className="btn-close" onClick={() => onProcessComplete(null)} aria-label="Close"></button>
      </div>

      {/* --- GRID LAYOUT (Cards are forced White) --- */}
      <div className="row text-center">
        {/* PO */}
        <div className="col-md-4">
          <div className="card border-primary h-100 bg-white">
            <div className="card-header bg-primary text-white font-weight-bold">Purchase Order</div>
            <div className="card-body">
              <h5 className="text-primary">#{po.poNumber}</h5>
              <hr/>
              <p className="mb-1 text-dark">Ordered: <strong>{po.orderedQty}</strong></p>
              <p className="mb-1 text-dark">Price: <strong>${po.unitPrice}</strong></p>
            </div>
          </div>
        </div>

        {/* GRN */}
        <div className="col-md-4">
          <div className={`card h-100 bg-white ${grn ? 'border-success' : 'border-warning'}`}>
            <div className={`card-header text-white font-weight-bold ${grn ? 'bg-success' : 'bg-warning'}`}>
              Goods Receipt
            </div>
            <div className="card-body">
              {grn ? (
                <>
                  <h5 className="text-success">#{grn.grnNumber}</h5>
                  <hr/>
                  <p className="mb-1 text-dark">Received: <strong>{grn.receivedQty}</strong></p>
                  <p className="text-muted small">{grn.receiptDate}</p>
                </>
              ) : (
                <p className="text-danger fw-bold mt-4">No GRN Found</p>
              )}
            </div>
          </div>
        </div>

        {/* INVOICE */}
        <div className="col-md-4">
          <div className="card border-info h-100 bg-white">
            <div className="card-header bg-info text-white font-weight-bold">Invoice</div>
            <div className="card-body">
              <h5 className="text-info">#{invoice.invoiceNumber}</h5>
              <hr/>
              <p className={isQtyMatch ? "text-success fw-bold" : "text-danger fw-bold"}>
                Billed: {invoice.billedQty}
              </p>
              <p className="text-dark">Total: <strong>${invoice.billedAmount}</strong></p>
              
              {/* STATUS PILLS */}
              <div className="mt-2 d-flex flex-column gap-1 align-items-center">
                {isPerfectPrice ? (
                     <span className="badge bg-success rounded-pill px-3">Price Match</span>
                ) : isTolerancePrice ? (
                     <span className="badge bg-warning text-dark rounded-pill px-3">Price Tolerance</span>
                ) : (
                     <span className="badge bg-danger rounded-pill px-3">Price Mismatch</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- ACTION BUTTONS --- */}
      <div className="mt-4 pt-3 border-top text-center">
         {/* We keep buttons visible even after clicking, until the modal closes */}
         {isOverallMatch ? (
            <p className="text-success fw-bold mb-3">✅ System Match Successful</p>
         ) : (
            <p className="text-danger fw-bold mb-3">🛑 Discrepancy Detected</p>
         )}

         <div className="d-flex justify-content-center gap-3">
            <button 
                className="btn btn-success btn-lg px-5 rounded-pill shadow-sm"
                onClick={() => handleDecision('APPROVED')}
                disabled={manualStatus !== null} // Disable buttons after click
            >
                Approve
            </button>
            
            {/* CHANGED: btn-outline-danger -> btn-danger (Solid Red) */}
            <button 
                className="btn btn-danger btn-lg px-5 rounded-pill shadow-sm"
                onClick={() => handleDecision('REJECTED')}
                disabled={manualStatus !== null}
            >
                Reject
            </button>
         </div>
      </div>

      {/* --- NEW TOAST NOTIFICATION (Bottom Center) --- */}
      {manualStatus && (
        <div 
            style={{
                position: 'fixed',
                bottom: '30px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 9999,
                minWidth: '300px'
            }}
            className="animate__animated animate__fadeInUp"
        >
            <div className={`px-4 py-3 shadow-lg rounded-pill text-white fw-bold d-flex align-items-center justify-content-center gap-3 ${manualStatus === 'APPROVED' ? 'bg-success' : 'bg-danger'}`}>
                <span style={{ fontSize: '1.5rem' }}>
                    {manualStatus === 'APPROVED' ? '✅' : '❌'}
                </span>
                <span style={{ fontSize: '1.1rem' }}>
                    {manualStatus === 'APPROVED' ? 'INVOICE APPROVED' : 'INVOICE REJECTED'}
                </span>
            </div>
        </div>
      )}

    </div>
  );
};

export default ThreeWayComparison;
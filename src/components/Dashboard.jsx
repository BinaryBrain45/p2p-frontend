import React, { useEffect, useState } from 'react';
import { getAllInvoices, getAllPOs, getAllGRNs, runMatch } from '../services/api';
import ThreeWayComparison from './ThreeWayComparison';
import FileUploader from './FileUploader';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [pos, setPos] = useState([]);
  const [grns, setGrns] = useState([]);
  
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);
  const [selectedGRN, setSelectedGRN] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  // Load Data on Startup
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invRes, poRes, grnRes] = await Promise.all([
        getAllInvoices(),
        getAllPOs(),
        getAllGRNs()
      ]);
      setInvoices(invRes.data);
      setPos(poRes.data);
      setGrns(grnRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // When user clicks "View" on an invoice
  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setMatchResult(null); // Reset previous results

    // Find related PO
    const relatedPO = pos.find(po => po.poNumber === invoice.poNumber);
    setSelectedPO(relatedPO);

    // Find related GRN (Assumes GRN also references the same PO)
    const relatedGRN = grns.find(grn => grn.poNumber === invoice.poNumber);
    setSelectedGRN(relatedGRN);
  };

  // Call your backend Match Logic
  const handleRunMatch = async (invoiceId) => {
    try {
      const res = await runMatch(invoiceId);
      setMatchResult(res.data);
      alert("Backend Match Result: " + JSON.stringify(res.data));
    } catch (error) {
      alert("Error running match logic");
    }
  };

  return (
    <div className="container mt-4">
      {/* --- FIX IS HERE: Added style={{ color: 'black' }} --- */}
      <h1 className="mb-4" style={{ color: 'black', fontWeight: 'bold' }}>
        Procure-to-Pay (P2P) Dashboard
      </h1>
      
      <FileUploader onUploadSuccess={fetchData} />

      {/* Existing: List of Pending Invoices */}
      <div className="card mb-4 bg-white">
        <div className="card-header text-dark font-weight-bold">Pending Invoices</div>
        <div className="card-body">
            {invoices.length === 0 ? (
                <p className="text-center text-muted">No invoices found. Use the Demo Tools above.</p>
            ) : (
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th className="text-dark">Invoice #</th>
                            <th className="text-dark">PO #</th>
                            <th className="text-dark">Amount</th>
                            <th className="text-dark">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.invoiceNumber}>
                                <td className="text-dark">{inv.invoiceNumber}</td>
                                <td className="text-dark">{inv.poNumber}</td>
                                <td className="text-dark">${inv.billedAmount}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleSelectInvoice(inv)}
                                    >
                                        Analyze Match
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {/* Existing: The 3-Way Match Visualizer */}
      {selectedInvoice && (
        <ThreeWayComparison 
            invoice={selectedInvoice}
            po={selectedPO}
            grn={selectedGRN}
            onMatch={handleRunMatch}
        />
      )}
    </div>
  );
};

export default Dashboard;
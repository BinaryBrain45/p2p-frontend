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

  const handleSelectInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    const relatedPO = pos.find(po => po.poNumber === invoice.poNumber);
    setSelectedPO(relatedPO);
    const relatedGRN = grns.find(grn => grn.poNumber === invoice.poNumber);
    setSelectedGRN(relatedGRN);
  };

  // --- NEW: Function to remove invoice from list after decision ---
  const handleProcessComplete = (invoiceId) => {
    // 1. Remove the processed invoice from the list (UI Only)
    setInvoices(prev => prev.filter(inv => inv.invoiceNumber !== invoiceId));
    
    // 2. Close the comparison view
    setSelectedInvoice(null);
    setSelectedPO(null);
    setSelectedGRN(null);
  };

  const handleRunMatch = async (invoiceId) => {
    try {
      const res = await runMatch(invoiceId);
      alert("Backend Match Result: " + JSON.stringify(res.data));
    } catch (error) {
      alert("Error running match logic");
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4" style={{ color: 'black', fontWeight: 'bold' }}>
        Procure-to-Pay (P2P) Dashboard
      </h1>
      
      <FileUploader onUploadSuccess={fetchData} />

      {/* Pending Invoices List */}
      <div className="card mb-4 bg-white shadow-sm">
        <div className="card-header bg-light text-dark font-weight-bold">
            Pending Invoices ({invoices.length})
        </div>
        <div className="card-body">
            {invoices.length === 0 ? (
                <p className="text-center text-muted p-3">🎉 All tasks completed! No pending invoices.</p>
            ) : (
                <table className="table table-hover mb-0">
                    <thead className="thead-light">
                        <tr>
                            <th>Invoice #</th>
                            <th>PO #</th>
                            <th>Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map(inv => (
                            <tr key={inv.invoiceNumber}>
                                <td className="align-middle">{inv.invoiceNumber}</td>
                                <td className="align-middle">{inv.poNumber}</td>
                                <td className="align-middle">${inv.billedAmount}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm px-3"
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

      {/* 3-Way Match Visualizer */}
      {selectedInvoice && (
        <ThreeWayComparison 
            invoice={selectedInvoice}
            po={selectedPO}
            grn={selectedGRN}
            onMatch={handleRunMatch}
            onProcessComplete={handleProcessComplete} // <-- Passing the new function
        />
      )}
    </div>
  );
};

export default Dashboard;
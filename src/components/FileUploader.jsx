import React, { useState } from 'react';
import { uploadPOFile, uploadGRNFile, uploadInvoiceFile } from '../services/api';

const FileUploader = ({ onUploadSuccess }) => {
    const [message, setMessage] = useState("");

    const handleUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setMessage(`Uploading ${type}...`);
            let response;
            
            if (type === 'PO') response = await uploadPOFile(file);
            if (type === 'GRN') response = await uploadGRNFile(file);
            if (type === 'Invoice') response = await uploadInvoiceFile(file);

            setMessage("✅ " + response.data);
            onUploadSuccess(); // Refresh the dashboard data
        } catch (error) {
            console.error(error);
            setMessage("❌ Upload Failed: " + (error.response?.data || error.message));
        }
    };

    return (
        <div className="card mb-4 bg-white text-dark shadow-sm">
            <div className="card-header bg-dark text-white">
                📂 Transaction Entry Module
            </div>
            <div className="card-body">
                <div className="row">
                    {/* Upload PO */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">1. Upload POs (CSV)</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            accept=".csv"
                            onChange={(e) => handleUpload(e, 'PO')} 
                        />
                    </div>

                    {/* Upload GRN */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">2. Upload GRNs (CSV)</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            accept=".csv"
                            onChange={(e) => handleUpload(e, 'GRN')} 
                        />
                    </div>

                    {/* Upload Invoice */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label fw-bold">3. Upload Invoices (CSV)</label>
                        <input 
                            type="file" 
                            className="form-control" 
                            accept=".csv"
                            onChange={(e) => handleUpload(e, 'Invoice')} 
                        />
                    </div>
                </div>
                {message && <div className="alert alert-info mt-2">{message}</div>}
            </div>
        </div>
    );
};

export default FileUploader;
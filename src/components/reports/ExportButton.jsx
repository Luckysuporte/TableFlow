import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToPDF, exportToExcel, exportToCSV } from '../../utils/exportUtils';

const ExportButton = ({ data, reportType, reportTitle }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = (format) => {
        try {
            if (format === 'pdf') {
                exportToPDF(data, reportType, reportTitle);
            } else if (format === 'excel') {
                exportToExcel(data, reportType, reportTitle);
            } else if (format === 'csv') {
                exportToCSV(data, reportType);
            }
            setShowMenu(false);
        } catch (error) {
            console.error('Error exporting:', error);
            alert('Erro ao exportar relatório. Tente novamente.');
        }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                }}
                className="hover-neon"
            >
                <Download size={18} />
                Exportar
            </button>

            <AnimatePresence>
                {showMenu && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'absolute',
                            top: '110%',
                            right: 0,
                            background: '#1a1a2e',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            padding: '8px',
                            minWidth: '150px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            zIndex: 100
                        }}
                    >
                        <button
                            onClick={() => handleExport('pdf')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '10px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            className="hover-neon"
                        >
                            <FileText size={16} color="#ef4444" />
                            PDF
                        </button>
                        <button
                            onClick={() => handleExport('excel')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '10px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            className="hover-neon"
                        >
                            <FileSpreadsheet size={16} color="#10b981" />
                            Excel
                        </button>
                        <button
                            onClick={() => handleExport('csv')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                width: '100%',
                                padding: '10px',
                                background: 'transparent',
                                border: 'none',
                                borderRadius: '6px',
                                color: 'white',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.2s'
                            }}
                            className="hover-neon"
                        >
                            <File size={16} color="#a855f7" />
                            CSV
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ExportButton;

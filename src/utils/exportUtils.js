import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Export to PDF
export const exportToPDF = (data, reportType, reportTitle) => {
    try {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.text(reportTitle, 14, 20);

        // Add date
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 28);

        let yPosition = 35;

        if (reportType === 'performance') {
            // Performance metrics
            doc.setFontSize(12);
            doc.text('Métricas de Performance', 14, yPosition);
            yPosition += 10;

            const metricsData = [
                ['Lucro Total', `R$ ${data.totalProfit?.toFixed(2) || '0.00'}`],
                ['Lucro por Mesa', `R$ ${data.profitPerAccount?.toFixed(2) || '0.00'}`],
                ['Média Diária', `R$ ${data.dailyAverage?.toFixed(2) || '0.00'}`],
                ['Média Semanal', `R$ ${data.weeklyAverage?.toFixed(2) || '0.00'}`],
                ['Média Mensal', `R$ ${data.monthlyAverage?.toFixed(2) || '0.00'}`]
            ];

            doc.autoTable({
                startY: yPosition,
                head: [['Métrica', 'Valor']],
                body: metricsData,
                theme: 'grid'
            });
        } else if (reportType === 'trades') {
            // Trade journal
            const tableData = data.logs?.map(log => {
                const accountId = log.accountId || log.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                return [
                    new Date(log.date).toLocaleDateString('pt-BR'),
                    accountName,
                    `R$ ${Number(log.amount).toFixed(2)}`
                ];
            }) || [];

            doc.autoTable({
                startY: yPosition,
                head: [['Data', 'Mesa', 'Resultado']],
                body: tableData,
                theme: 'striped'
            });
        } else if (reportType === 'withdrawals') {
            // Withdrawals
            const tableData = data.withdrawals?.map(w => {
                const accountId = w.accountId || w.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                return [
                    new Date(w.date).toLocaleDateString('pt-BR'),
                    accountName,
                    `R$ ${Number(w.grossAmount || w.gross_amount || 0).toFixed(2)}`,
                    `${Number(w.taxPercentage || w.tax_percentage || 0)}%`,
                    `R$ ${Number(w.netAmount || w.net_amount || 0).toFixed(2)}`
                ];
            }) || [];

            doc.autoTable({
                startY: yPosition,
                head: [['Data', 'Mesa', 'Valor Bruto', 'Imposto', 'Valor Líquido']],
                body: tableData,
                theme: 'striped'
            });
        }

        // Save PDF
        doc.save(`${reportType}_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Erro ao gerar PDF');
    }
};

// Export to Excel
export const exportToExcel = (data, reportType, reportTitle) => {
    try {
        let worksheetData = [];

        if (reportType === 'performance') {
            worksheetData = [
                ['Relatório de Performance'],
                ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
                [],
                ['Métrica', 'Valor'],
                ['Lucro Total', `R$ ${data.totalProfit?.toFixed(2) || '0.00'}`],
                ['Lucro por Mesa', `R$ ${data.profitPerAccount?.toFixed(2) || '0.00'}`],
                ['Média Diária', `R$ ${data.dailyAverage?.toFixed(2) || '0.00'}`],
                ['Média Semanal', `R$ ${data.weeklyAverage?.toFixed(2) || '0.00'}`],
                ['Média Mensal', `R$ ${data.monthlyAverage?.toFixed(2) || '0.00'}`]
            ];
        } else if (reportType === 'trades') {
            worksheetData = [
                ['Diário de Trades'],
                ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
                [],
                ['Data', 'Mesa', 'Resultado']
            ];

            data.logs?.forEach(log => {
                const accountId = log.accountId || log.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                worksheetData.push([
                    new Date(log.date).toLocaleDateString('pt-BR'),
                    accountName,
                    Number(log.amount).toFixed(2)
                ]);
            });
        } else if (reportType === 'withdrawals') {
            worksheetData = [
                ['Relatório de Saques'],
                ['Gerado em:', new Date().toLocaleDateString('pt-BR')],
                [],
                ['Data', 'Mesa', 'Valor Bruto', 'Imposto %', 'Valor Líquido']
            ];

            data.withdrawals?.forEach(w => {
                const accountId = w.accountId || w.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                worksheetData.push([
                    new Date(w.date).toLocaleDateString('pt-BR'),
                    accountName,
                    Number(w.grossAmount || w.gross_amount || 0).toFixed(2),
                    Number(w.taxPercentage || w.tax_percentage || 0),
                    Number(w.netAmount || w.net_amount || 0).toFixed(2)
                ]);
            });
        }

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

        XLSX.writeFile(workbook, `${reportType}_${new Date().getTime()}.xlsx`);
    } catch (error) {
        console.error('Error generating Excel:', error);
        throw new Error('Erro ao gerar Excel');
    }
};

// Export to CSV
export const exportToCSV = (data, reportType) => {
    try {
        let csvContent = '';

        if (reportType === 'performance') {
            csvContent = 'Métrica,Valor\n';
            csvContent += `Lucro Total,R$ ${data.totalProfit?.toFixed(2) || '0.00'}\n`;
            csvContent += `Lucro por Mesa,R$ ${data.profitPerAccount?.toFixed(2) || '0.00'}\n`;
            csvContent += `Média Diária,R$ ${data.dailyAverage?.toFixed(2) || '0.00'}\n`;
            csvContent += `Média Semanal,R$ ${data.weeklyAverage?.toFixed(2) || '0.00'}\n`;
            csvContent += `Média Mensal,R$ ${data.monthlyAverage?.toFixed(2) || '0.00'}\n`;
        } else if (reportType === 'trades') {
            csvContent = 'Data,Mesa,Resultado\n';
            data.logs?.forEach(log => {
                const accountId = log.accountId || log.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                csvContent += `${new Date(log.date).toLocaleDateString('pt-BR')},`;
                csvContent += `${accountName},`;
                csvContent += `R$ ${Number(log.amount).toFixed(2)}\n`;
            });
        } else if (reportType === 'withdrawals') {
            csvContent = 'Data,Mesa,Valor Bruto,Imposto %,Valor Líquido\n';
            data.withdrawals?.forEach(w => {
                const accountId = w.accountId || w.account_id;
                const accountName = data.accounts?.find(a => a.id === accountId)?.name || 'N/A';
                csvContent += `${new Date(w.date).toLocaleDateString('pt-BR')},`;
                csvContent += `${accountName},`;
                csvContent += `R$ ${Number(w.grossAmount || w.gross_amount || 0).toFixed(2)},`;
                csvContent += `${Number(w.taxPercentage || w.tax_percentage || 0)}%,`;
                csvContent += `R$ ${Number(w.netAmount || w.net_amount || 0).toFixed(2)}\n`;
            });
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${reportType}_${new Date().getTime()}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error generating CSV:', error);
        throw new Error('Erro ao gerar CSV');
    }
};

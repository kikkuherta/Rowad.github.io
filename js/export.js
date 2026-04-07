// Lightweight export utilities (CSV, Word, PDF) and report generator
window.Export = (function(){
  function downloadCSV(filename, csvContent){
    const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function buildGradesCSV(students, grades){
    const header = ['رقم','الاسم','واجب(/10)','مشاركة(/10)','اختبار(/30)','نشاط(/10)','المجموع'];
    const rows = students.map(s=>{
      const g=grades[s.id]||{hw:0,part:0,exam:0,act:0};
      const total = g.hw+g.part+g.exam+g.act;
      return [s.num, s.name, g.hw, g.part, g.exam, g.act, total];
    });
    const all = [header].concat(rows).map(r=>r.map(cell=>`"${String(cell).replace(/"/g,'""')}"`).join(',')).join('\r\n');
    return '\uFEFF'+all; // add BOM for Excel Arabic support
  }

  function downloadReportExcel() {
    const printArea = document.getElementById('a4-print-area');
    if(!printArea) return;
    
    const tables = printArea.querySelectorAll('table');
    if(tables.length === 0) {
      if(window.showToast) window.showToast('لا يوجد بيانات لتصديرها', '');
      return;
    }

    const rows = [];
    tables.forEach((table, index) => {
      const trs = table.querySelectorAll('tr');
      trs.forEach((tr, trIndex) => {
        // Prevent duplicating headers if not the first table
        if (index > 0 && trIndex === 0) return;
        
        const cols = Array.from(tr.querySelectorAll('th, td'));
        const rowData = cols.map(col => `"${col.innerText.trim().replace(/"/g, '""').replace(/\r?\n|\r/g, ' ')}"`);
        rows.push(rowData.join(','));
      });
    });

    const csvContent = '\uFEFF' + rows.join('\r\n'); // BOM required for Arabic characters in Excel natively
    downloadCSV('تقرير_مفصل_Excel.csv', csvContent);
    if(window.showToast) window.showToast('✅ تم التصدير بصيغة Excel', 'success');
  }

  function downloadReportWord() {
    const printArea = document.getElementById('a4-print-area');
    if(!printArea) return;
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Report</title>
        <style>
          body { font-family: 'Arial', sans-serif; dir: rtl; text-align: right; direction: rtl; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: center; }
          th { background-color: #f1f5f9; font-weight: bold; }
          .a4-header { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
          .a4-title { text-align: center; font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 20px; color: #000; }
          .a4-signatures { margin-top: 50px; display: flex; justify-content: space-around; width: 100%; }
          .a4-signatures div { text-align: center; display: inline-block; width: 45%; }
        </style>
      </head>
      <body>${printArea.innerHTML}</body>
      </html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'تقرير_الفصل.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if(window.showToast) window.showToast('✅ تم تحميل ملف Word', 'success');
  }

  function downloadReportPDF() {
    const printArea = document.getElementById('a4-print-area');
    if(!printArea) return;
    if(typeof html2pdf !== 'undefined') {
      if(window.showToast) window.showToast('جارٍ تجهيز ملف PDF...');
      const opt = {
        margin:       10,
        filename:     'تقرير_الفصل.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(printArea).save().then(()=>{
          if(window.showToast) window.showToast('✅ تم تحميل ملف PDF', 'success');
      });
    } else {
      // Fallback
      window.print();
    }
  }

  return { downloadCSV, buildGradesCSV, downloadReportWord, downloadReportPDF, downloadReportExcel };
})();


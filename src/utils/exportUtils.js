import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatDate } from './dateUtils';

// ---------- helpers ----------

const sanitizeFilename = (name) =>
  (name || 'export').toString().replace(/[^a-z0-9-_]+/gi, '_');

const stepsToText = (steps) => {
  if (!steps) return '-';
  if (Array.isArray(steps)) {
    return steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  }
  if (typeof steps === 'string') {
    return steps
      .split('\n')
      .filter(Boolean)
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n');
  }
  return String(steps);
};

const addPdfHeader = (doc, title, subtitle) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - 28;

  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(title || '', maxWidth);
  doc.text(titleLines, 14, 18);

  let y = 18 + titleLines.length * 7;

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    const subtitleLines = doc.splitTextToSize(subtitle, maxWidth);
    doc.text(subtitleLines, 14, y);
    doc.setTextColor(0);
    y += subtitleLines.length * 5;
  }

  return y;
};

const savePdf = (doc, filename) => {
  doc.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
};

const saveExcel = (workbook, filename) => {
  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
};

// ---------- Tickets (dashboard list) ----------

export const exportTicketsToPDF = (tickets) => {
  const doc = new jsPDF();
  const headerY = addPdfHeader(doc, 'QA Tickets', `Generated ${formatDate(new Date().toISOString())}`);

  autoTable(doc, {
    startY: headerY + 8,
    head: [['Jira Ticket', 'Ticket Name', 'Type', 'Platform', 'Status', 'Test Cases', 'Test Runs', 'QA Failed', 'Updated At']],
    body: tickets.map((t) => [
      t.id,
      t.name,
      t.type,
      t.platform,
      t.status,
      t.testCaseCount ?? t.test_case_count ?? 0,
      t.testRunCount ?? t.test_run_count ?? 0,
      t.qaFailedCount ?? t.qa_failed_count ?? 0,
      formatDate(t.updated_at || t.updatedAt)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 102, 204] }
  });

  savePdf(doc, 'qa_tickets');
};

export const exportTicketsToExcel = (tickets) => {
  const rows = tickets.map((t) => ({
    'Jira Ticket': t.id,
    'Ticket Name': t.name,
    Type: t.type,
    Platform: t.platform,
    Status: t.status,
    'Test Cases': t.testCaseCount ?? t.test_case_count ?? 0,
    'Test Runs': t.testRunCount ?? t.test_run_count ?? 0,
    'QA Failed': t.qaFailedCount ?? t.qa_failed_count ?? 0,
    'Updated At': formatDate(t.updated_at || t.updatedAt)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tickets');
  saveExcel(workbook, 'qa_tickets');
};

export const exportTicketToPDF = (ticket, testCases = [], testRuns = []) => {
  const doc = new jsPDF();
  const headerY = addPdfHeader(doc, `${ticket.id} - ${ticket.name}`, `Generated ${formatDate(new Date().toISOString())}`);

  const qaFailedCount = testRuns.filter((tr) => tr.status === 'QA Failed').length;

  autoTable(doc, {
    startY: headerY + 8,
    body: [
      ['Type', ticket.type],
      ['Platform', ticket.platform],
      ['Status', ticket.status],
      ['Test Cases', testCases.length],
      ['Test Runs', testRuns.length],
      ['QA Failed Count', qaFailedCount],
      ['Updated At', formatDate(ticket.updated_at || ticket.updatedAt)]
    ],
    theme: 'plain',
    styles: { fontSize: 10 }
  });

  let nextY = (doc.lastAutoTable?.finalY || headerY + 8) + 10;

  if (testCases.length > 0) {
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Test Cases', 14, nextY);
    doc.setFont(undefined, 'normal');
    nextY += 6;

    autoTable(doc, {
      startY: nextY,
      head: [['TC ID', 'Title', 'Component', 'Platform', 'Status', 'Description']],
      body: testCases.map((tc) => [
        tc.id,
        tc.title,
        tc.component,
        tc.platform,
        tc.status,
        tc.description || '-'
      ]),
      styles: { fontSize: 8 },
      columnStyles: { 5: { cellWidth: 60 } },
      headStyles: { fillColor: [0, 102, 204] }
    });
    nextY = (doc.lastAutoTable?.finalY || nextY) + 10;
  }

  if (testRuns.length > 0) {
    if (nextY > 250) {
      doc.addPage();
      nextY = 20;
    }
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Test Runs', 14, nextY);
    doc.setFont(undefined, 'normal');
    nextY += 6;

    autoTable(doc, {
      startY: nextY,
      head: [['Run ID', 'Test Case ID', 'Platform', 'Version', 'Status', 'QA Failed', 'Executed At']],
      body: testRuns.map((tr) => [
        tr.id,
        tr.test_case_id || tr.testCaseId,
        tr.platform,
        tr.version,
        tr.status,
        tr.qa_failed_count ?? tr.qaFailedCount ?? 0,
        formatDate(tr.executed_at || tr.executedAt)
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 102, 204] }
    });
  }

  savePdf(doc, `${sanitizeFilename(ticket.id)}_ticket`);
};

export const exportTicketToExcel = (ticket, testCases = [], testRuns = []) => {
  const qaFailedCount = testRuns.filter((tr) => tr.status === 'QA Failed').length;

  const overviewRows = [{
    'Jira Ticket': ticket.id,
    'Ticket Name': ticket.name,
    Type: ticket.type,
    Platform: ticket.platform,
    Status: ticket.status,
    'Test Cases': testCases.length,
    'Test Runs': testRuns.length,
    'QA Failed': qaFailedCount,
    'Updated At': formatDate(ticket.updated_at || ticket.updatedAt)
  }];

  const workbook = XLSX.utils.book_new();
  const overviewSheet = XLSX.utils.json_to_sheet(overviewRows);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Ticket');

  if (testCases.length > 0) {
    const testCaseRows = testCases.map((tc) => ({
      'TC ID': tc.id,
      Title: tc.title,
      Component: tc.component,
      Platform: tc.platform,
      Status: tc.status,
      Description: tc.description || '',
      'Pre-Conditions': tc.pre_conditions || tc.preConditions || '',
      'Test Steps': stepsToText(tc.test_steps || tc.testSteps),
      'Expected Result': tc.expected_result || tc.expectedResult || '',
      'Updated At': formatDate(tc.updated_at || tc.updatedAt)
    }));
    const testCaseSheet = XLSX.utils.json_to_sheet(testCaseRows);
    XLSX.utils.book_append_sheet(workbook, testCaseSheet, 'Test Cases');
  }

  if (testRuns.length > 0) {
    const testRunRows = testRuns.map((tr) => ({
      'Run ID': tr.id,
      'Test Case ID': tr.test_case_id || tr.testCaseId,
      Platform: tr.platform,
      Version: tr.version,
      Status: tr.status,
      'QA Failed Count': tr.qa_failed_count ?? tr.qaFailedCount ?? 0,
      'Executed By': tr.executed_by || tr.executedBy || '-',
      'Executed At': formatDate(tr.executed_at || tr.executedAt),
      'Actual Result': tr.actual_result || '-',
      'Test Notes': tr.test_notes || '-'
    }));
    const testRunSheet = XLSX.utils.json_to_sheet(testRunRows);
    XLSX.utils.book_append_sheet(workbook, testRunSheet, 'Test Runs');
  }

  saveExcel(workbook, `${sanitizeFilename(ticket.id)}_ticket`);
};

// ---------- Test Cases (list) ----------

export const exportTestCasesToPDF = (ticket, testCases) => {
  const doc = new jsPDF();
  const headerY = addPdfHeader(doc, `Test Cases - ${ticket.id}`, ticket.name);

  autoTable(doc, {
    startY: headerY + 8,
    head: [['TC ID', 'Title', 'Component', 'Platform', 'Status', 'Updated At']],
    body: testCases.map((tc) => [
      tc.id,
      tc.title,
      tc.component,
      tc.platform,
      tc.status,
      formatDate(tc.updated_at || tc.updatedAt)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 102, 204] }
  });

  savePdf(doc, `${sanitizeFilename(ticket.id)}_test_cases`);
};

export const exportTestCasesToExcel = (ticket, testCases) => {
  const rows = testCases.map((tc) => ({
    'TC ID': tc.id,
    Title: tc.title,
    Component: tc.component,
    Platform: tc.platform,
    Status: tc.status,
    Description: tc.description || '',
    'Pre-Conditions': tc.pre_conditions || tc.preConditions || '',
    'Test Steps': stepsToText(tc.test_steps || tc.testSteps),
    'Expected Result': tc.expected_result || tc.expectedResult || '',
    'Updated At': formatDate(tc.updated_at || tc.updatedAt)
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Cases');
  saveExcel(workbook, `${sanitizeFilename(ticket.id)}_test_cases`);
};

// ---------- Single Test Case ----------

export const exportTestCaseToPDF = (ticket, testCase) => {
  const doc = new jsPDF();
  const headerY = addPdfHeader(doc, `${testCase.id} - ${testCase.title}`, `${ticket.id} - ${ticket.name}`);

  autoTable(doc, {
    startY: headerY + 8,
    body: [
      ['Component', testCase.component || '-'],
      ['Platform', testCase.platform || '-'],
      ['Status', testCase.status || '-'],
      ['Created By', testCase.created_by || testCase.createdBy || '-'],
      ['Created At', formatDate(testCase.created_at || testCase.createdAt)],
      ['Updated At', formatDate(testCase.updated_at || testCase.updatedAt)],
      ['Approved By', testCase.approved_by || testCase.approvedBy || '-'],
      ['Approved At', formatDate(testCase.approved_at || testCase.approvedAt)]
    ],
    theme: 'plain',
    styles: { fontSize: 10 }
  });

  let nextY = (doc.lastAutoTable?.finalY || headerY + 8) + 10;

  const addSection = (label, text) => {
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(label, 14, nextY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text || '-', 180);
    doc.text(lines, 14, nextY + 6);
    nextY += 6 + lines.length * 5 + 6;

    if (nextY > 270) {
      doc.addPage();
      nextY = 20;
    }
  };

  addSection('Description', testCase.description);
  addSection('Pre-Conditions', testCase.pre_conditions || testCase.preConditions);
  addSection('Test Steps', stepsToText(testCase.test_steps || testCase.testSteps));
  addSection('Expected Result', testCase.expected_result || testCase.expectedResult);

  const customTables = testCase.custom_tables || testCase.customTables || [];
  customTables.forEach((table) => {
    if (nextY > 250) {
      doc.addPage();
      nextY = 20;
    }
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(table.name, 14, nextY);
    doc.setFont(undefined, 'normal');
    autoTable(doc, {
      startY: nextY + 4,
      head: [table.columns],
      body: table.rows,
      styles: { fontSize: 8 }
    });
    nextY = (doc.lastAutoTable?.finalY || nextY + 4) + 10;
  });

  savePdf(doc, `${sanitizeFilename(testCase.id)}`);
};

export const exportTestCaseToExcel = (ticket, testCase) => {
  const overviewRows = [{
    'TC ID': testCase.id,
    Title: testCase.title,
    Component: testCase.component,
    Platform: testCase.platform,
    Status: testCase.status,
    'Created By': testCase.created_by || testCase.createdBy || '-',
    'Created At': formatDate(testCase.created_at || testCase.createdAt),
    'Updated At': formatDate(testCase.updated_at || testCase.updatedAt),
    'Approved By': testCase.approved_by || testCase.approvedBy || '-',
    'Approved At': formatDate(testCase.approved_at || testCase.approvedAt),
    Description: testCase.description || '',
    'Pre-Conditions': testCase.pre_conditions || testCase.preConditions || '',
    'Test Steps': stepsToText(testCase.test_steps || testCase.testSteps),
    'Expected Result': testCase.expected_result || testCase.expectedResult || ''
  }];

  const workbook = XLSX.utils.book_new();
  const overviewSheet = XLSX.utils.json_to_sheet(overviewRows);
  XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Test Case');

  const customTables = testCase.custom_tables || testCase.customTables || [];
  customTables.forEach((table, idx) => {
    const sheetData = [table.columns, ...table.rows];
    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    const sheetName = (table.name || `Table ${idx + 1}`).substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  });

  saveExcel(workbook, `${sanitizeFilename(testCase.id)}`);
};

// ---------- Test Runs (list) ----------

export const exportTestRunsToPDF = (ticket, testRuns) => {
  const doc = new jsPDF();
  const headerY = addPdfHeader(doc, `Test Runs - ${ticket.id}`, ticket.name);

  autoTable(doc, {
    startY: headerY + 8,
    head: [['Run ID', 'Test Case ID', 'Platform', 'Version', 'Status', 'QA Failed', 'Executed At']],
    body: testRuns.map((tr) => [
      tr.id,
      tr.test_case_id || tr.testCaseId,
      tr.platform,
      tr.version,
      tr.status,
      tr.qa_failed_count ?? tr.qaFailedCount ?? 0,
      formatDate(tr.executed_at || tr.executedAt)
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 102, 204] }
  });

  savePdf(doc, `${sanitizeFilename(ticket.id)}_test_runs`);
};

export const exportTestRunsToExcel = (ticket, testRuns) => {
  const rows = testRuns.map((tr) => ({
    'Run ID': tr.id,
    'Test Case ID': tr.test_case_id || tr.testCaseId,
    Platform: tr.platform,
    Version: tr.version,
    Status: tr.status,
    'QA Failed Count': tr.qa_failed_count ?? tr.qaFailedCount ?? 0,
    'Executed By': tr.executed_by || tr.executedBy || '-',
    'Executed At': formatDate(tr.executed_at || tr.executedAt),
    'Actual Result': tr.actual_result || '-',
    'Test Notes': tr.test_notes || '-'
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Runs');
  saveExcel(workbook, `${sanitizeFilename(ticket.id)}_test_runs`);
};

// ---------- Single Test Run ----------

export const exportTestRunToPDF = (ticket, testRun, testCase) => {
  const doc = new jsPDF();
  const title = `${testRun.id} - ${testCase?.title || testRun.testCaseTitle || ''}`;
  const headerY = addPdfHeader(doc, title, `${ticket.id} - ${ticket.name}`);

  autoTable(doc, {
    startY: headerY + 8,
    body: [
      ['Version / Cycle', testRun.version || '-'],
      ['Test Case', testCase?.id || testRun.test_case_id || testRun.testCaseId || '-'],
      ['Platform', testRun.platform || '-'],
      ['Status', testRun.status || '-'],
      ['QA Failed Count', testRun.qa_failed_count ?? testRun.qaFailedCount ?? 0],
      ['Executed By', testRun.executed_by || testRun.executedBy || '-'],
      ['Executed At', formatDate(testRun.executed_at || testRun.executedAt)]
    ],
    theme: 'plain',
    styles: { fontSize: 10 }
  });

  let nextY = (doc.lastAutoTable?.finalY || headerY + 8) + 10;

  const addSection = (label, text) => {
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(label, 14, nextY);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(text || '-', 180);
    doc.text(lines, 14, nextY + 6);
    nextY += 6 + lines.length * 5 + 6;

    if (nextY > 270) {
      doc.addPage();
      nextY = 20;
    }
  };

  addSection('Description', testCase?.description);
  addSection('Pre-Conditions', testCase?.pre_conditions);
  addSection('Test Steps', stepsToText(testCase?.test_steps));
  addSection('Expected Result', testCase?.expected_result);
  addSection('Actual Result', testRun.actual_result);
  addSection('Test Notes', testRun.test_notes);

  const customTables = testCase?.custom_tables || testCase?.customTables || [];
  customTables.forEach((table) => {
    if (nextY > 250) {
      doc.addPage();
      nextY = 20;
    }
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text(table.name, 14, nextY);
    doc.setFont(undefined, 'normal');
    autoTable(doc, {
      startY: nextY + 4,
      head: [table.columns],
      body: table.rows,
      styles: { fontSize: 8 }
    });
    nextY = (doc.lastAutoTable?.finalY || nextY + 4) + 10;
  });

  savePdf(doc, `${sanitizeFilename(testRun.id)}`);
};

export const exportTestRunToExcel = (ticket, testRun, testCase) => {
  const rows = [{
    'Run ID': testRun.id,
    'Test Case ID': testCase?.id || testRun.test_case_id || testRun.testCaseId,
    'Test Case Title': testCase?.title || testRun.testCaseTitle || '-',
    Platform: testRun.platform,
    Version: testRun.version,
    Status: testRun.status,
    'QA Failed Count': testRun.qa_failed_count ?? testRun.qaFailedCount ?? 0,
    'Executed By': testRun.executed_by || testRun.executedBy || '-',
    'Executed At': formatDate(testRun.executed_at || testRun.executedAt),
    Description: testCase?.description || '-',
    'Pre-Conditions': testCase?.pre_conditions || '-',
    'Test Steps': stepsToText(testCase?.test_steps),
    'Expected Result': testCase?.expected_result || '-',
    'Actual Result': testRun.actual_result || '-',
    'Test Notes': testRun.test_notes || '-'
  }];

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Test Run');

  const customTables = testCase?.custom_tables || testCase?.customTables || [];
  customTables.forEach((table, idx) => {
    const sheetData = [table.columns, ...table.rows];
    const sheet = XLSX.utils.aoa_to_sheet(sheetData);
    const sheetName = (table.name || `Table ${idx + 1}`).substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
  });

  saveExcel(workbook, `${sanitizeFilename(testRun.id)}`);
};

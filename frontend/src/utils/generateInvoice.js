import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STORE = {
  name: 'TrendCart',
  tagline: 'Your Fashion Destination',
  address: '123 Fashion Street, Ghaziabad, Uttar Pradesh',
  email: 'support@trendcart.com',
  phone: '+91 9876543210',
  gstin: '09ABCDE1234F1Z5',
};

const fmt = (n) => Number(n || 0).toFixed(2);

export const generateInvoice = (order, currency = '$', userProfile = null) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const addr = order.address || {};
  const invoiceDate = new Date().toDateString();
  const orderDate = new Date(order.date).toDateString();

  // ── Header bar ──────────────────────────────────────────
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, W, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(STORE.name.toUpperCase(), 14, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(STORE.tagline, 14, 19);
  doc.text(STORE.address, 14, 24);
  doc.text(`${STORE.email}  |  ${STORE.phone}`, 14, 29);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('INVOICE', W - 14, 14, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`GSTIN: ${STORE.gstin}`, W - 14, 22, { align: 'right' });

  // ── Invoice meta + Customer details (two columns) ───────
  doc.setTextColor(0, 0, 0);
  let y = 40;

  // left: invoice info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('INVOICE DETAILS', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const invoiceLines = [
    ['Invoice No.', `INV-${order.orderId}`],
    ['Invoice Date', invoiceDate],
    ['Order ID', order.orderId],
    ['Order Date', orderDate],
  ];
  invoiceLines.forEach(([label, val], i) => {
    doc.setTextColor(120);
    doc.text(label + ':', 14, y + 7 + i * 6);
    doc.setTextColor(0);
    doc.text(String(val), 50, y + 7 + i * 6);
  });

  // right: customer info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text('CUSTOMER DETAILS', W / 2 + 5, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  const custLines = [
    ['Name', addr.fullName || userProfile?.name || '—'],
    ['Phone', addr.phone || userProfile?.phone || '—'],
    ['Email', userProfile?.email || '—'],
  ];
  custLines.forEach(([label, val], i) => {
    doc.setTextColor(120);
    doc.text(label + ':', W / 2 + 5, y + 7 + i * 6);
    doc.setTextColor(0);
    doc.text(String(val), W / 2 + 28, y + 7 + i * 6);
  });

  // ── Shipping address block ───────────────────────────────
  y += 38;
  doc.setFillColor(248, 248, 248);
  doc.rect(14, y, W - 28, 28, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text('SHIPPING ADDRESS', 18, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  const addrLines = [
    `${addr.houseNo || ''}, ${addr.street || ''}${addr.landmark ? ', ' + addr.landmark : ''}`,
    `${addr.city || ''}, ${addr.state || ''} - ${addr.pincode || ''}`,
    addr.country || '',
  ].filter(Boolean);
  addrLines.forEach((line, i) => doc.text(line, 18, y + 13 + i * 5));

  // ── Products table ───────────────────────────────────────
  y += 34;
  autoTable(doc, {
    startY: y,
    head: [['#', 'Product', 'Brand', 'Size', 'Color', 'Qty', 'Unit Price', 'Total']],
    body: order.items.map((item, i) => [
      i + 1,
      item.name || '—',
      item.brand || '—',
      item.size || '—',
      item.color || '—',
      item.quantity,
      `${currency}${fmt(item.price)}`,
      `${currency}${fmt(item.price * item.quantity)}`,
    ]),
    styles: { fontSize: 8, cellPadding: 3, textColor: [30, 30, 30] },
    headStyles: {
      fillColor: [15, 15, 15],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 52 },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14 },
  });

  // ── Payment summary ──────────────────────────────────────
  const tableEndY = doc.lastAutoTable.finalY + 6;
  const colL = W - 80;
  const colR = W - 14;

  const summaryRows = [
    ['Subtotal', `${currency}${fmt(order.subtotal || order.amount)}`],
    ['Shipping Charges', `${currency}${fmt(order.shippingCharge ?? 10)}`],
    ['Discount', order.discount > 0 ? `-${currency}${fmt(order.discount)}` : '—'],
    ['Tax', order.tax > 0 ? `${currency}${fmt(order.tax)}` : '—'],
  ];

  doc.setFontSize(8);
  summaryRows.forEach(([label, val], i) => {
    doc.setTextColor(100);
    doc.text(label, colL, tableEndY + i * 6);
    doc.setTextColor(0);
    doc.text(val, colR, tableEndY + i * 6, { align: 'right' });
  });

  const totalY = tableEndY + summaryRows.length * 6 + 2;
  doc.setDrawColor(200);
  doc.line(colL, totalY, colR, totalY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text('Grand Total', colL, totalY + 7);
  doc.text(`${currency}${fmt(order.amount)}`, colR, totalY + 7, { align: 'right' });

  // ── Payment info ─────────────────────────────────────────
  const payY = totalY + 16;
  doc.setFillColor(248, 248, 248);
  doc.rect(14, payY, W - 28, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text('PAYMENT INFORMATION', 18, payY + 6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0);
  const payLines = [
    `Method: ${order.paymentMethod}   |   Status: ${order.payment ? 'Paid' : 'Pending'}`,
    order.paymentOrderId ? `Transaction ID: ${order.paymentOrderId}` : '',
  ].filter(Boolean);
  payLines.forEach((line, i) => doc.text(line, 18, payY + 13 + i * 5));

  // ── Footer ───────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(15, 15, 15);
  doc.rect(0, pageH - 16, W, 16, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Thank you for shopping with TrendCart!', W / 2, pageH - 9, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', W / 2, pageH - 4, { align: 'center' });

  doc.save(`Invoice_${order.orderId}.pdf`);
};

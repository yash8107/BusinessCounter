import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { drawPageBorder, registerFonts, formattedText, generateHr, formatCurrency, AmountInWords } from './designFormat.js';
import QRCode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createInvoice(doc, invoice, size) {
    // Determine scaling factor based on page size
    const scaleFactor = getScaleFactor(size);

    // Register Roboto font
    registerFonts(doc);

    doc.on('pageAdded', () => {
        drawPageBorder(doc, scaleFactor); // Add border on new pages
    });

    drawPageBorder(doc, scaleFactor); // Initial page border
    addTaxInvoiceHeader(doc, scaleFactor);
    generateHeader(doc, invoice, scaleFactor);
    generateCustomerInformation(doc, invoice, scaleFactor);
    generateInvoiceTable(doc, invoice, scaleFactor);
    generateTotalSummary(doc, invoice, scaleFactor);
    taxDetails(doc, invoice, scaleFactor);
    bankDetailsandSignature(doc, invoice, scaleFactor);
    // NotesandtermandCondition(doc, invoice, scaleFactor);
}

function getScaleFactor(size) {
    switch (size) {
        case 'A3':
            return 1.4;
        case 'A4':
            return 1;
        case 'A5':
            return 0.7;
        default:
            return 1;
    }
}

function addTaxInvoiceHeader(doc, scaleFactor) {
    const pageWidth = doc.page.width;
    const margin = 40 * scaleFactor; // Updated to match border margin

    doc.fontSize(12 * scaleFactor)
        .font('Roboto-Medium')
        .text('Tax Invoice', 0, margin - 20 * scaleFactor, { // Adjusted y-position for header
            align: 'center',
            width: pageWidth,
            underline: false,
        });
    doc.fontSize(8 * scaleFactor)
        .font('Roboto')
        .text('ORIGINAL FOR RECIPIENT', 0, margin - 16 * scaleFactor, { // Adjusted y-position for header
            align: 'right',
            width: pageWidth-35,
            underline: false,
        });
}

function generateHeader(doc, invoice, scaleFactor) {
    const logoPath = path.join(__dirname, '../../public/logo.png');
    const headerX = 110 * scaleFactor;
    const headerY = 50 * scaleFactor;

    // Render logo
    doc.image(logoPath, 36 * scaleFactor, 46 * scaleFactor, { width: 70 * scaleFactor });

    // Render company name
    doc.font('Roboto-Medium')
        .fontSize(10 * scaleFactor)
        .text(`${invoice.companyName}`, headerX, headerY - 7, { width: 400, ellipsis: true });

    doc.font('Roboto').fontSize(8 * scaleFactor);

    // Render company details
    const textSections = [
        `Website: ${invoice.companyWebsite}`,
        `Email: ${invoice.companyEmail}`,
        `Address: ${invoice.companyAddress}`,
        `GST No: ${invoice.gstin}`,
        `Phone: ${invoice.companyPhone}`,
    ];

    let currentY = headerY + 4; // Start from an initial Y position
    const baseWidth = 200; // Define the base width
    const maxWidth = baseWidth * scaleFactor;
    const fontSize = 8 * scaleFactor;

    textSections.forEach((section) => {
        const textHeight = doc.heightOfString(section, { width: maxWidth, fontSize }); // Calculate height dynamically
        doc.text(section, headerX, currentY, { width: maxWidth, ellipsis: true });
        currentY += textHeight + 2; // Move down for the next line, adding padding
    });

    // Calculate dynamic line positions
    const startX = headerX + (190 * scaleFactor);
    const startY = headerY - (9 * scaleFactor);
    const endY = currentY + (10 * scaleFactor); // Adjust dynamically based on content height

    // Draw vertical line
    doc.moveTo(startX, startY)
        .lineTo(startX, endY)
        .stroke();

    // Draw horizontal line
    generateHr(doc, endY);

    // Render additional formatted text dynamically
    const fontSize1 = 10 * scaleFactor;

    // Label in regular font
    doc.font('Roboto-Bold')
        .fontSize(fontSize1)
        .text('Invoice #: ', startX + 8, startY + 3, scaleFactor)
        .text('Invoice Date: ', startX + 138, startY + 3, scaleFactor)
        .text('Supply Place: ',  startX + 8, startY + 22, scaleFactor)
        .text('Due Date: ',  startX + 138, startY + 22, scaleFactor)
        .text('E-way Bill #: ', startX + 8, startY + 42, scaleFactor)
        .text('Vehicle Number: ', startX + 138, startY + 42, scaleFactor);

        // Value in bold font
    doc.font('Helvetica')
        .fontSize(fontSize1)
        .text(`INV-${invoice.invoiceNumber}`, startX + 54, startY + 4, scaleFactor)
        .text(`${invoice.issueDate}`, startX + 200, startY + 4, scaleFactor)
        .text(`${invoice.supplyPlace}`, startX + 70, startY + 24, scaleFactor)
        .text(`${invoice.dueDate}`, startX + 185, startY + 24, scaleFactor)
        .text(`${invoice.ewaybillNo}`, startX + 8, startY + 56, scaleFactor)
        .text(`${invoice.vehicleNo}`, startX + 138, startY + 56, scaleFactor);
    // formattedText(doc, 'Vehicle Number: ', `${invoice.vehicleNo}`, startX + 138, startY + 44, scaleFactor);

    // Draw vertical line in between formatted sections
    doc.moveTo(startX + 132, startY)
        .lineTo(startX + 132, startY + 70)
        .stroke();
    
    // Draw horizontal line below the header
    doc.moveTo(startX, startY + 18).lineTo(startX + 266, startY + 18).stroke();
    doc.moveTo(startX, startY + 36).lineTo(startX + 266, startY + 36).stroke();
    doc.moveTo(startX, startY + 70).lineTo(startX + 266, startY + 70).stroke();
}

function generateCustomerInformation(doc, invoice, scaleFactor) {
    const startX = 36 * scaleFactor;
    const startY = doc.y * scaleFactor;
    const customerInformationTop = startY -16 * scaleFactor;

    // Helper to render dynamic fields
    function renderSection(title, data, startX, startY) {
        doc.font('Roboto-Bold').text(title, startX, startY);

        let currentY = startY + 15 * scaleFactor; // Adjust for the title spacing

        // Iterate over each field in the data object
        for (const key in data) {
            const fieldText = data[key];
            const fieldHeight = doc.heightOfString(fieldText, {
                width: 200 * scaleFactor,
                fontSize: 8 * scaleFactor,
            });

            doc.font('Roboto').text(fieldText, startX, currentY, {
                width: 200 * scaleFactor,
                ellipsis: true,
            });

            currentY += fieldHeight + 1; // Update Y for the next field with padding or distance
        }

        return currentY; // Return the final Y position
    }

    // Render Billing Section
    const billingData = {
        Name: invoice.billTo.name,
        Address: invoice.billTo.address,
        City: invoice.billTo.city,
        Phone: invoice.billTo.phone,
    };
    const billingEndY = renderSection(
        'Billing address:',
        billingData,
        startX,
        customerInformationTop + 40 * scaleFactor
    );

    // Render Shipping Section
    const shippingStartX = startX + 270 * scaleFactor;
    const shippingData = {
        Name: invoice.shipTo.name,
        Address: invoice.shipTo.address,
        City: invoice.shipTo.city,
        Phone: invoice.shipTo.phone
    };
    const shippingEndY = renderSection(
        'Shipping address:',
        shippingData,
        shippingStartX,
        customerInformationTop + 40 * scaleFactor
    );

    // Draw horizontal line below the longer section
    const horizontalLineY = Math.max(billingEndY, shippingEndY) + 10 * scaleFactor;
    doc.moveTo(startX - 6, horizontalLineY)
        .lineTo(startX + 530 * scaleFactor, horizontalLineY)
        .stroke();

    // Draw vertical line separating the sections
    doc.moveTo(startX + 264 * scaleFactor, customerInformationTop + 36 * scaleFactor)
        .lineTo(startX + 264 * scaleFactor, horizontalLineY)
        .stroke();

    // Update doc.y to avoid overlap
    doc.y = horizontalLineY + 10 * scaleFactor;// Return the final Y position to be used for the next section
}

const generateInvoiceTable = (doc, invoice, scaleFactor) => {
    const tableStartY = doc.y - 5;
    const tableStartX = 36 * scaleFactor;
    const margin = 36 * scaleFactor;  // Set margin (same for left and right)
    const allowedWidth = doc.page.width - 2 * margin; // Max width for the table

    const columnWidths = {
        number: 20 * scaleFactor,
        item: 135 * scaleFactor,
        hsnSac: 50 * scaleFactor,
        qty: 45 * scaleFactor,
        rateItem: 65 * scaleFactor,
        discount: 40 * scaleFactor,
        taxAmount: 60 * scaleFactor,
        amount: 100 * scaleFactor,
    };

    // Dynamic adjustments for specific columns
    const adjustments = {
        item: 5 * scaleFactor,     // Additional spacing for 'item' column
        hsnSac: -5 * scaleFactor,   // Additional spacing for 'hsnSac' column
        qty:  5* scaleFactor,      // Reduce spacing for 'qty' column
        rateItem: -6 * scaleFactor, // No adjustment for 'rateItem'
        discount: 12 * scaleFactor,  // Add more space for 'discount' column
        taxAmount: 32 * scaleFactor,  // Add more space for 'discount' column
        amount: -10 * scaleFactor,  // Add more space for 'discount' column
    };

    // Apply adjustments to the columnWidths
    const adjustedColumnWidths = { ...columnWidths };
    Object.keys(adjustments).forEach(key => {
        adjustedColumnWidths[key] += adjustments[key];
    });

    // Calculate the total width of the table
    const totalTableWidth = Object.values(adjustedColumnWidths).reduce((a, b) => a + b, 0);

    // If the total width exceeds the allowed width, auto-adjust the remaining columns proportionally
    if (totalTableWidth > allowedWidth) {
        const scaleFactorAdjustment = allowedWidth / totalTableWidth;
        Object.keys(adjustedColumnWidths).forEach(key => {
            adjustedColumnWidths[key] *= scaleFactorAdjustment;
        });
    }

    // Calculate row height dynamically based on content length
    const calculateRowHeight = (doc, content, columnWidth) => {
        const textWidth = doc.widthOfString(content);
        const lines = Math.ceil(textWidth / columnWidth);  // Calculate how many lines needed
        return lines * 12 * scaleFactor;  // Return height for the content (12px per line)
    };

    const generateTableRow = (doc, y, data, isHeader = false, isLastRow = false) => {
        const fontSize = isHeader ? 10 * scaleFactor : 9 * scaleFactor;
        const font = isHeader ? 'Roboto-Medium' : 'Helvetica';

        doc.font(font).fontSize(fontSize);

        // Draw each column
        const positions = [
            { key: 'number', align: 'left' },
            { key: 'item', align: 'left' },
            { key: 'hsnSac', align: 'left' },
            { key: 'qty', align: 'right' },
            { key: 'rateItem', align: 'right' },
            { key: 'discount', align: 'right' },
            { key: 'taxAmount', align: 'right' },
            { key: 'amount', align: 'right' },
        ];

        let currentX = tableStartX;
        let rowHeight = 20 * scaleFactor; // Default row height

        // Dynamically adjust row height for 'item' and other potentially long fields
        positions.forEach(({ key, align }) => {
            const content = data[key];
            if (key === 'item') {
                rowHeight = Math.max(rowHeight, calculateRowHeight(doc, content, adjustedColumnWidths[key]));
            }
        });

        let currentY = y;
        const verticalLinePositions = [
            adjustedColumnWidths['number']-5,
            adjustedColumnWidths['item'] + adjustedColumnWidths['number']-4,
            adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number']+5,
            adjustedColumnWidths['qty'] + adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number'] +5,
            adjustedColumnWidths['rateItem'] + adjustedColumnWidths['qty'] + adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number']+7,
            adjustedColumnWidths['discount'] + adjustedColumnWidths['rateItem'] + adjustedColumnWidths['qty'] + adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number']+5,
            adjustedColumnWidths['taxAmount'] + adjustedColumnWidths['discount'] + adjustedColumnWidths['rateItem'] + adjustedColumnWidths['qty'] + adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number']+1,
            adjustedColumnWidths['amount'] + adjustedColumnWidths['taxAmount'] + adjustedColumnWidths['discount'] + adjustedColumnWidths['rateItem'] + adjustedColumnWidths['qty'] + adjustedColumnWidths['hsnSac'] + adjustedColumnWidths['item'] + adjustedColumnWidths['number']
        ];

        if (isLastRow) {
            rowHeight -= 8; // Decrease row height for the last row
        }
        positions.forEach(({ key, align }, index) => {
            doc.text(data[key], currentX, currentY + 2, {
                width: adjustedColumnWidths[key],
                align,
            });

            if (index < positions.length - 1) {
                const lineStartY = currentY - 4;
                const lineEndY = currentY + rowHeight + 8;
                const adjustedLineEndY = isHeader ? lineEndY + 5 : lineEndY; // Increase line height by 20 for header row

                doc.moveTo(tableStartX + verticalLinePositions[index], lineStartY)
                    .lineTo(tableStartX + verticalLinePositions[index], adjustedLineEndY)
                    .stroke();
            }

            currentX += adjustedColumnWidths[key];
        });

        return rowHeight + 8;  // Return the row height for adjusting Y position for the next row
    };

    // Draw table header
    const drawHeader = (y) => {
        generateTableRow(doc, y, {
            number: '#',
            item: 'Item',
            hsnSac: 'HSN/SAC',
            qty: 'Qty',
            rateItem: 'Rate/Item (₹)',
            discount: 'Discount (₹)',
            taxAmount: 'Tax Amount (₹)',
            amount: 'Amount',
        }, true, false);
        generateHr(doc, y + 25 * scaleFactor);
        return y + 30 * scaleFactor; // Return new Y position
    };

    // Draw horizontal line
    const generateHr = (doc, y) => {
        doc.strokeColor('#000000')
            .lineWidth(1)
            .moveTo(tableStartX - 6, y)  // Fixed starting point (X=30)
            .lineTo(tableStartX + 6 + allowedWidth, y)  // Fixed end point
            .stroke();
    };

    // Handle table rows
    let yPos = drawHeader(tableStartY);
    invoice.items.forEach((item, index) => {
        if (yPos > doc.page.height - 50 * scaleFactor) {
            doc.addPage();
            yPos = drawHeader(44 * scaleFactor);
        }

        // Calculate tax amount dynamically
        const taxableAmount = item.rateItem - item.discount; // Net amount after discount
        const taxAmount = item.qty * taxableAmount * (item.tax / 100); // Tax based on the taxable amount
        const amount = (item.qty * taxableAmount) + taxAmount; // Total amount (with tax)
        
        // Draw row data based on the header
        const rowHeight = generateTableRow(doc, yPos, {
            number: (index + 1).toString(),
            item: item.item,
            hsnSac: item.hsnSac,
            qty: item.qty + "Cars",
            rateItem: formatCurrency(item.rateItem),
            discount: formatCurrency(item.discount),
            taxAmount: formatCurrency(taxAmount) + ` (${(item.tax)}%)`,
            amount: formatCurrency(amount),
        });
        generateHr(doc, yPos + rowHeight);
        yPos += rowHeight+5;
    });

    
    const totalValues = {
        qty: invoice.items.reduce((sum, item) => sum + item.qty, 0),
        discount: invoice.items.reduce((sum, item) => sum + item.discount, 0),
        taxAmount: invoice.items.reduce((sum, item) => sum + item.qty * item.rateItem * (item.tax / 100), 0),
        amount: invoice.items.reduce((sum, item) => sum + (item.qty * item.rateItem + item.qty * item.rateItem * (item.tax / 100) - item.discount), 0),
    };

    // Add Total row
    if (yPos > doc.page.height - 100 * scaleFactor) {
        doc.addPage();
        yPos = drawHeader(50 * scaleFactor);
    }

    generateTableRow(doc, yPos, {
        number: '',
        item: 'Total',
        hsnSac: '',
        qty: totalValues.qty.toString(),
        rateItem: '',
        discount: formatCurrency(totalValues.discount),
        taxAmount: formatCurrency(totalValues.taxAmount),
        amount: formatCurrency(totalValues.amount),
    }, false, true);
    generateHr(doc, yPos + 20 * scaleFactor);
};

function generateTotalSummary(doc, invoice, scaleFactor) {
    const startX = 36 * scaleFactor;
    let startY = doc.y + 1 * scaleFactor;

    // Calculate total values
    const totalValues = {
        qty: invoice.items.reduce((sum, item) => sum + item.qty, 0),
        discount: invoice.items.reduce((sum, item) => sum + item.discount, 0),
        taxAmount: invoice.items.reduce((sum, item) => sum + item.qty * item.rateItem * (item.tax / 100), 0),
        amount: invoice.items.reduce((sum, item) => sum + (item.qty * item.rateItem + item.qty * item.rateItem * (item.tax / 100) - item.discount), 0),
    };

    // Amount in words
    const amountInWords = AmountInWords(totalValues.amount);

    // Calculate height needed for amount in words
    const amountInWordsHeight = doc.heightOfString(amountInWords, { width: 250 * scaleFactor });

    // Check if there is enough space on the current page
    if (startY + amountInWordsHeight + 50 * scaleFactor > doc.page.height - 40 * scaleFactor) {
        doc.addPage();
        startY = 32* scaleFactor; // Reset the Y position for the new page
    }

    // Render amount in words
    doc.font('Roboto-Bold').text('Amount in Words: ', startX, startY + 30 * scaleFactor);
    doc.font('Roboto')
        .text(amountInWords, startX, startY + 45 * scaleFactor, { width: 250 * scaleFactor, ellipsis: true });

    // Draw vertical line in between amount in words and total values
    doc.moveTo(startX + 265, startY + 9).lineTo(startX + 265, startY + 100).stroke();
    // Draw horizontal lines on the right side of the vertical line
    doc.moveTo(startX + 265, startY + 27).lineTo(startX + 530, startY + 27).stroke();
    doc.moveTo(startX + 265, startY + 45).lineTo(startX + 530, startY + 45).stroke();
    doc.moveTo(startX + 265, startY + 63).lineTo(startX + 530, startY + 63).stroke();
    doc.moveTo(startX + 265, startY + 81).lineTo(startX + 530, startY + 81).stroke();

    // Final horizontal line for Tax details
    doc.moveTo(startX - 6, startY + 100).lineTo(startX + 530, startY + 100).stroke();

    // Render total values
    doc.font('Roboto')
        .text('Shipping Cost', startX + 270, startY + 12 * scaleFactor)
        .text('Additional Discount', startX + 270, startY + 30 * scaleFactor)
        .text('Payable Amount', startX + 270, startY + 48 * scaleFactor)
        .text('Received Amount', startX + 270, startY + 66 * scaleFactor)
        .text('Balance Due', startX + 270, startY + 84 * scaleFactor);

    doc.font('Roboto')
        .text("500", startX + 460, startY + 12, { width: 64 * scaleFactor, align: 'right', ellipsis: true })
        .text(totalValues.discount, startX + 460, startY + 30, { width: 64 * scaleFactor, align: 'right', ellipsis: true })
        .text(totalValues.amount, startX + 460, startY + 48, { width: 64 * scaleFactor, align: 'right', ellipsis: true })
        .text("40", startX + 460, startY + 66, { width: 64 * scaleFactor, align: 'right', ellipsis: true })
        .text("10000", startX + 460, startY + 84, { width: 64 * scaleFactor, align: 'right', ellipsis: true });
}

function taxDetails(doc, invoice, scaleFactor) {
    const startX = 36 * scaleFactor;
    let startY = doc.y + 10 * scaleFactor; // Space below the total summary

    // Define column headers and widths
    const headers = ["HSN/SAC", "Taxable Amount(₹)", "CGST", "", "SGST", "", "Total Tax Amount(₹)"];
    const subHeaders = ["", "", "Rate (%)", "Amount(₹)", "Rate (%)", "Amount(₹)", ""];
    const columnWidths = [80, 100, 60, 50, 60, 50, 130];

    // Check if there is enough space on the current page for headers and subheaders
    if (startY + 40 > doc.page.height - 60 * scaleFactor) {
        doc.addPage();
        startY = 45 * scaleFactor; // Reset the Y position for the new page
    }

    // Render main headers
    let currentX = startX;
    doc.font('Roboto-Bold');
    headers.forEach((header, index) => {
        doc.text(header, currentX, startY, { width: columnWidths[index], align: 'center' });
        currentX += columnWidths[index];
    });

    startY += 20; // Move to sub-header row

    // Render sub-headers
    currentX = startX;
    doc.font('Roboto');
    subHeaders.forEach((subHeader, index) => {
        doc.text(subHeader, currentX, startY, { width: columnWidths[index], align: 'center' });
        currentX += columnWidths[index];
    });

    // Draw header separation line
    doc.moveTo(startX - 6, startY + 15).lineTo(startX + columnWidths.reduce((sum, width) => sum + width, 0), startY + 15).stroke();
    doc.moveTo(225, startY - 5).lineTo(434, startY - 5).stroke();

    // Draw vertical lines for table headers
    doc.moveTo(125, startY - 25).lineTo(125, startY + 15).stroke();
    doc.moveTo(225, startY - 25).lineTo(225, startY + 15).stroke();
    doc.moveTo(327, startY - 25).lineTo(327, startY + 15).stroke();
    doc.moveTo(434, startY - 25).lineTo(434, startY + 15).stroke();

    // Draw vertical line between rate and amount
    doc.moveTo(270, startY - 5).lineTo(270, startY + 15).stroke();
    doc.moveTo(374, startY - 5).lineTo(374, startY + 15).stroke();

    startY += 20; // Move down for table rows

    // Group items by tax rate
    const taxGroups = {};
    let totalTaxableAmount = 0, totalCgstAmount = 0, totalSgstAmount = 0, totalTaxAmount = 0;

    invoice.items.forEach(item => {
        const taxRate = item.tax.toFixed(2);
        if (!taxGroups[taxRate]) {
            taxGroups[taxRate] = { hsn: new Set(), taxableAmount: 0, cgstAmount: 0, sgstAmount: 0 };
        }
        taxGroups[taxRate].hsn.add(item.hsn || "N/A");
        const taxableAmount = item.qty * item.rateItem;
        const taxAmount = taxableAmount * (item.tax / 2) / 100; // Half for CGST, half for SGST
        taxGroups[taxRate].taxableAmount += taxableAmount;
        taxGroups[taxRate].cgstAmount += taxAmount;
        taxGroups[taxRate].sgstAmount += taxAmount;
    });

    // Render table rows dynamically
    Object.keys(taxGroups).forEach(taxRate => {
        let rowX = startX;
        const group = taxGroups[taxRate];

        totalTaxableAmount += group.taxableAmount;
        totalCgstAmount += group.cgstAmount;
        totalSgstAmount += group.sgstAmount;
        totalTaxAmount += group.cgstAmount + group.sgstAmount;

        const rowData = [
            Array.from(group.hsn).join(", "), // Combined HSN/SAC
            `${group.taxableAmount.toFixed(2)}`, // Total Taxable Amount
            `${taxRate}%`, // CGST Rate
            `${group.cgstAmount.toFixed(2)}`, // CGST Amount
            `${taxRate}%`, // SGST Rate
            `${group.sgstAmount.toFixed(2)}`, // SGST Amount
            `${(group.cgstAmount + group.sgstAmount).toFixed(2)}`, // Total Tax Amount
        ];

        // Calculate row height dynamically based on content length
        const rowHeight = Math.max(...rowData.map((text, index) => {
            return doc.heightOfString(text, { width: columnWidths[index], align: 'center' });
        })) + 5 * scaleFactor;

        // Check if a new page is needed
        if (startY + rowHeight > doc.page.height - 40 * scaleFactor) {
            doc.addPage();
            startY = 40 * scaleFactor;
        }

        rowData.forEach((text, index) => {
            doc.text(text, rowX, startY, { width: columnWidths[index], align: 'center' });
            rowX += columnWidths[index];
        });

        // Draw vertical lines for each row
        doc.moveTo(125, startY - 5).lineTo(125, startY + rowHeight).stroke();
        doc.moveTo(225, startY - 5).lineTo(225, startY + rowHeight).stroke();
        doc.moveTo(327, startY - 5).lineTo(327, startY + rowHeight).stroke();
        doc.moveTo(434, startY - 5).lineTo(434, startY + rowHeight).stroke();

        // Draw vertical line between rate and amount
        doc.moveTo(270, startY - 5).lineTo(270, startY + rowHeight).stroke();
        doc.moveTo(374, startY - 5).lineTo(374, startY + rowHeight).stroke();

        // Draw horizontal line for each row
        doc.moveTo(rowX, startY + rowHeight).lineTo(rowX - 536, startY + rowHeight).stroke();
        startY += rowHeight + 5; // Move to next row
    });

    // Draw total row
    let rowX = startX;
    const totalRowData = [
        "Total", // Label
        `${totalTaxableAmount.toFixed(2)}`, // Total Taxable Amount
        "", // Empty CGST Rate
        `${totalCgstAmount.toFixed(2)}`, // Total CGST Amount
        "", // Empty SGST Rate
        `${totalSgstAmount.toFixed(2)}`, // Total SGST Amount
        `${totalTaxAmount.toFixed(2)}` // Total Tax Amount
    ];

    // Check if a new page is needed
    if (startY + 20 > doc.page.height - 40 * scaleFactor) {
        doc.addPage();
        startY = 40 * scaleFactor;
    }

    totalRowData.forEach((text, index) => {
        doc.text(text, rowX, startY, { width: columnWidths[index], align: 'center' });
        rowX += columnWidths[index];
    });

    // Draw vertical lines for total row
    doc.moveTo(125, startY - 5).lineTo(125, startY + 20).stroke();
    doc.moveTo(225, startY - 5).lineTo(225, startY + 20).stroke();
    doc.moveTo(327, startY - 5).lineTo(327, startY + 20).stroke();
    doc.moveTo(434, startY - 5).lineTo(434, startY + 20).stroke();
    // Draw vertical line between rate and amount
    doc.moveTo(270, startY - 5).lineTo(270, startY + 20).stroke();
    doc.moveTo(374, startY - 5).lineTo(374, startY + 20).stroke();

    // Draw horizontal line below total row
    doc.moveTo(startX - 6, startY + 20).lineTo(startX + columnWidths.reduce((sum, width) => sum + width, 0), startY + 20).stroke();
}


// Function to add bank details and QR code
async function bankDetailsandSignature(doc, invoice, scaleFactor) {
    const logoPath = path.join(__dirname, '../../public/logo.png');
    let startX = 36 * scaleFactor;
    let startY = doc.y + 10 * scaleFactor;
    const sectionHeight = 90 * scaleFactor; // Adjust this value based on your content

    // Check if there is enough space on the current page
    if (doc.y + sectionHeight > doc.page.height - 40 * scaleFactor) {
            // If not, add a new page
        doc.addPage();
        doc.y = 40 * scaleFactor; // Reset the Y position for the new page
        startY = doc.y + 1 * scaleFactor; // Update the startY position
    }
    // Bank Details Section
    doc.font('Roboto-Bold').text('Bank Details:', startX, startY);
    doc.font('Roboto').text(`Bank Name: ${invoice.bankDetails.bankName}`, startX, startY + 20);
    doc.text(`Account Name: ${invoice.bankDetails.accountName}`, startX, startY + 35);
    doc.text(`Account Number: ${invoice.bankDetails.accountNumber}`, startX, startY + 50);
    doc.text(`IFSC Code: ${invoice.bankDetails.ifscCode}`, startX, startY + 65);

    // Signature Section
    const signatureX = 420 * scaleFactor; // Align signature to the right
    doc.font('Roboto').text(`For ${invoice.companyName}`, signatureX, startY);

    // Render logo
    doc.image(logoPath, signatureX+35, startY+15, { width: 50 * scaleFactor });
    doc.font('Roboto-Bold').text('Authorized Signature:', signatureX + 15, startY+78);
    // doc.font('Roboto').text('________________________', signatureX, startY + 30);
    // doc.text(invoice.authorizedSignatory, signatureX, startY + 10);

    // Draw horizontal line below the signature
    doc.moveTo(startX-6, startY+95).lineTo(startX + 530, startY + 95).stroke();
    // Draw vertical line in between bank details and signature
    doc.moveTo(signatureX -20, startY-6).lineTo(signatureX - 20, startY + 95).stroke();
}

// Function to decode Base64 image data
// function decodeBase64Image(dataString) {
//     const matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
//     if (!matches || matches.length !== 3) {
//         throw new Error('Invalid Base64 image data');
//     }
//     return Buffer.from(matches[2], 'base64');
// }


// function NotesandtermandCondition(doc, invoice, scaleFactor) {
//     const startX = 36 * scaleFactor;
//     const startY = doc.y + 10 * scaleFactor;

//     // Notes Section
//     doc.font('Roboto-Bold').text('Notes:', startX, startY);
//     doc.font('Roboto').text(invoice.notes, startX, startY + 20, { width: 500, align: 'left' });

//     // Terms & Conditions Section
//     doc.font('Roboto-Bold').text('Terms & Conditions:', startX, startY + 60);
//     invoice.termsAndConditions.forEach((term, index) => {
//         doc.font('Roboto').text(`${index + 1}. ${term}`, startX, startY + 80 + (index * 15), { width: 500, align: 'left' });
//     });
// }
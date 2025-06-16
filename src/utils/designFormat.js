import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'number-to-words';
const { toWords } = pkg;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function registerFonts(doc) {
    const robotoRegularPath = path.join(__dirname, '../font/roboto/Roboto-Regular.ttf');
    const robotoBoldPath = path.join(__dirname, '../font/roboto/Roboto-Bold.ttf');
    const robotoMediumPath = path.join(__dirname, '../font/roboto/Roboto-Medium.ttf');
    doc.registerFont('Roboto', robotoRegularPath);
    doc.registerFont('Roboto-Bold', robotoBoldPath);
    doc.registerFont('Roboto-Medium', robotoMediumPath);
}

export function drawPageBorder(doc, scaleFactor) {
    const sideMargin = 30 * scaleFactor; // Left, right, bottom margins
    const topMargin = 40 * scaleFactor; // Top margin
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    doc.rect(
        sideMargin,
        topMargin,
        pageWidth - 2 * sideMargin,
        pageHeight - topMargin - sideMargin // Adjust for top and bottom margins
    )
        .strokeColor('#000000')
        .lineWidth(1)
        .stroke();
}

// Define a helper function for formatted text
export function formattedText(doc, label, value, x, y, scaleFactor) {
    const fontSize = 10 * scaleFactor;

    // Label in regular font
    doc.font('Helvetica-Bold')
        .fontSize(fontSize)
        .text(label, x, y, { continued: true });

    // Value in bold font
    doc.font('Helvetica')
        .fontSize(fontSize)
        .text(value);
}

// Define a helper function for generating horizontal lines
export function generateHr(doc, y) {
    doc.strokeColor('#000000')
        .lineWidth(1)
        .moveTo(30, y)
        .lineTo(566, y)
        .stroke();
}

export function formatCurrency(amount) {
    // Check if the amount is a valid number
    if (typeof amount !== 'number' || isNaN(amount)) {
        console.error('Invalid amount:', amount); // You can log or handle this case as per your requirement
        return '₹0.00'; // Return a default value if the amount is invalid
    }
    return amount.toFixed(2); // Format the valid amount
}

export function AmountInWords(amount) {
    return toWords(amount);
}
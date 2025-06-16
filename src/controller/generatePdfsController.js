import PDFDocument from 'pdfkit';
import { createInvoice } from '../utils/generateInvoice.js';

export async function generateInvoice(req="123", res) {
    const size = req.query.size || 'A4';
    // const invoice = req.body;
    const invoice = {
        invoiceNumber: '12345',
        companyName: 'Business Counter Pvt Ltd ',
        companyWebsite: 'www.businesscounter.com',
        companyEmail: 'yashsinghal8107@gmail.com',
        companyAddress: 'Bangalore, Karnataka, India Bangalore, Karnataka, India Bangalore, Karnataka, India',
        gstin: "09AABCU1234F1Z5",
        companyPhone: '123456789',
        issueDate: '2025-12-25',
        supplyPlace: 'Bangalore',
        dueDate: '2025-01-10',
        ewaybillNo: '123456789012',
        vehicleNo: 'KA01AB1234',
        billTo: {
            name: 'JohnDoe',
            address: '123, MainStreet Bangalore, Karnataka, India, 123, MainStreet Bangalore, Karnataka, India',
            phone: '123456789',
            phone: '123456789',
        },
        shipTo: {
            name: 'JohnDoe',
            address: '123, MainStreet Bangalore, Karnataka, India, 123, MainStreet Bangalore,123, MainStreet Bangalore,123, MainStreet Bangalore,',
            phone: '123456789',
        },
        items: [
            { item: 'Widget', hsnSac: 13216543100, qty: 2000, rateItem: 1000000000, discount: 10, tax: 18},
            { item: 'Wifsdf dgethgj hjkh jkhjh jkhjkh jkhklh jjjhg kjhkjh bkjhk df sfdsdfd sfsdgsdgf dgf asdfdf adadfdsa', hsnSac: 132165431, qty: 25, rateItem: 100, discount: 10, tax: 18 },
            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 10, discount: 10, tax: 18},
            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 100, discount: 10, tax: 18},
            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widgethiuy jhjhnmn hjhj jhjhj jhjhkjkjlkj lkjlklk jkjlkj ljlk jkl jkljkj kjlkj ljlkj jlkj lkjkjkjlkjlkkjkjkjlkjkjjh  jhkhkljkjlkj  kjlkj k khl kjkj kj lk kkjlk j ', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},            { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
            // { item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},{ item: 'Widget', hsnSac: 1321654311, qty: 25, rateItem: 1000, discount: 10, tax: 18},
        ],
        subTotal: 250,
        paidToDate: 0,
        balance: 250,
        bankDetails: {
            bankName: "National Bank of India",
            accountName: "ABC Enterprises",
            accountNumber: "123456789012",
            ifscCode: "NBIN0001234"
        },
        authorizedSignatory: "John Doe",
        notes: "Thank you for your business! Please make the payment within 30 days.",
        termsAndConditions: [
            "Payment is due within 30 days from the invoice date.",
            "Late payments will incur an interest charge of 1.5% per month.",
            "Goods are non-returnable unless defective.",
            "E-Invoice generated and uploaded to the GSTN portal as per the new 30-day rule."
        ]
    };

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');

    const doc = new PDFDocument({ size: size, margins: { top: 50, bottom: 30, left: 30, right: 30 } });
    createInvoice(doc, invoice, size);

    doc.pipe(res);
    doc.end();
}

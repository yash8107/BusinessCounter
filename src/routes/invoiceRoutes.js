import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import { generateInvoice } from '../controller/generatePdfsController.js';

const router = express.Router();

// Route to generate and download an invoice
router.get('/generate', generateInvoice);

export default router;
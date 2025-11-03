/**
 * PDF Generator Class
 * 
 * Object-oriented approach to generate branded PDF documents
 * for receipts and quotations with Orizon branding
 */

export interface DocumentItem {
  description: string;
  quantity: number;
  amount: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
}

export interface ReceiptData {
  receiptNumber: string;
  customer: CustomerInfo;
  amount: number;
  date: string;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'refunded';
  items: number;
}

export interface QuotationData {
  quotationNumber: string;
  customer: CustomerInfo;
  amount: number;
  createdDate: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  items: number;
}

/**
 * Base Document Generator Class
 * Abstract class providing common functionality for all document types
 */
abstract class BaseDocumentGenerator {
  protected brandName: string = 'ORIZON';
  protected brandTagline: string = 'PROFESSIONAL BUSINESS SOLUTIONS';
  protected brandColor: string = '#3b82f6';
  protected brandColorDark: string = '#1d4ed8';

  /**
   * Get common CSS styles for all documents
   */
  protected getBaseStyles(): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
        padding: 40px; 
        background: #f5f5f5; 
      }
      .document-container { 
        max-width: 800px; 
        margin: 0 auto; 
        background: white; 
        padding: 60px; 
        box-shadow: 0 0 20px rgba(0,0,0,0.1); 
      }
      .header { 
        text-align: center; 
        margin-bottom: 40px; 
        padding-bottom: 30px; 
        border-bottom: 3px solid ${this.brandColor}; 
      }
      .logo { 
        font-size: 48px; 
        font-weight: bold; 
        background: linear-gradient(135deg, ${this.brandColor} 0%, ${this.brandColorDark} 100%); 
        -webkit-background-clip: text; 
        -webkit-text-fill-color: transparent; 
        background-clip: text;
        margin-bottom: 10px; 
      }
      .tagline { 
        color: #6b7280; 
        font-size: 14px; 
        letter-spacing: 2px; 
      }
      .document-title { 
        font-size: 32px; 
        font-weight: bold; 
        color: #1f2937; 
        margin: 30px 0 10px; 
      }
      .document-number { 
        color: #6b7280; 
        font-size: 18px; 
        margin-bottom: 30px; 
      }
      .info-section { 
        display: flex; 
        justify-content: space-between; 
        margin-bottom: 40px; 
      }
      .info-block { 
        flex: 1; 
      }
      .info-label { 
        font-weight: 600; 
        color: #374151; 
        margin-bottom: 8px; 
        font-size: 12px; 
        text-transform: uppercase; 
        letter-spacing: 1px; 
      }
      .info-value { 
        color: #1f2937; 
        font-size: 16px; 
        line-height: 1.6; 
      }
      .amount-section { 
        background: linear-gradient(135deg, ${this.brandColor} 0%, ${this.brandColorDark} 100%); 
        padding: 30px; 
        border-radius: 12px; 
        margin: 40px 0; 
        text-align: center; 
      }
      .amount-label { 
        color: rgba(255,255,255,0.9); 
        font-size: 14px; 
        margin-bottom: 8px; 
        letter-spacing: 1px; 
      }
      .amount-value { 
        color: white; 
        font-size: 48px; 
        font-weight: bold; 
      }
      .details-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 30px 0; 
      }
      .details-table th { 
        background: #f3f4f6; 
        padding: 12px; 
        text-align: left; 
        font-weight: 600; 
        color: #374151; 
        font-size: 12px; 
        text-transform: uppercase; 
      }
      .details-table td { 
        padding: 12px; 
        border-bottom: 1px solid #e5e7eb; 
        color: #1f2937; 
      }
      .footer { 
        margin-top: 60px; 
        padding-top: 30px; 
        border-top: 2px solid #e5e7eb; 
        text-align: center; 
        color: #6b7280; 
        font-size: 14px; 
      }
      .footer-strong { 
        font-weight: 600; 
        color: ${this.brandColor}; 
      }
      @media print {
        body { background: white; padding: 0; }
        .document-container { box-shadow: none; padding: 40px; }
      }
    `;
  }

  /**
   * Generate header HTML
   */
  protected generateHeader(): string {
    return `
      <div class="header">
        <div class="logo">${this.brandName}</div>
        <div class="tagline">${this.brandTagline}</div>
      </div>
    `;
  }

  /**
   * Generate customer info section
   */
  protected generateCustomerInfo(customer: CustomerInfo): string {
    return `
      <strong>${customer.name}</strong><br>
      ${customer.email}
    `;
  }

  /**
   * Generate footer HTML
   */
  protected generateFooter(contactEmail: string, message: string): string {
    return `
      <div class="footer">
        <p style="margin-bottom: 10px;"><span class="footer-strong">${message}</span></p>
        <p>This is an official document from ${this.brandName}.</p>
        <p style="margin-top: 10px; font-size: 12px;">If you have any questions, please contact us at ${contactEmail}</p>
      </div>
    `;
  }

  /**
   * Abstract method to be implemented by subclasses
   */
  abstract generateHTML(): string;

  /**
   * Print the document
   */
  print(): void {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(this.generateHTML());
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  }

  /**
   * Download the document as HTML
   */
  download(filename: string): void {
    const html = this.generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Receipt Generator Class
 * Generates branded receipt documents
 */
export class ReceiptGenerator extends BaseDocumentGenerator {
  private data: ReceiptData;

  constructor(data: ReceiptData) {
    super();
    this.data = data;
  }

  /**
   * Get status badge CSS class
   */
  private getStatusBadgeClass(): string {
    const statusClasses = {
      paid: 'status-paid',
      pending: 'status-pending',
      refunded: 'status-refunded'
    };
    return statusClasses[this.data.status];
  }

  /**
   * Get receipt-specific styles
   */
  private getReceiptStyles(): string {
    return `
      .status-badge { 
        display: inline-block; 
        padding: 6px 16px; 
        border-radius: 20px; 
        font-size: 12px; 
        font-weight: 600; 
        text-transform: uppercase; 
      }
      .status-paid { background: #d1fae5; color: #065f46; }
      .status-pending { background: #fef3c7; color: #92400e; }
      .status-refunded { background: #fee2e2; color: #991b1b; }
    `;
  }

  /**
   * Generate complete receipt HTML
   */
  generateHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Receipt ${this.data.receiptNumber}</title>
        <style>
          ${this.getBaseStyles()}
          ${this.getReceiptStyles()}
        </style>
      </head>
      <body>
        <div class="document-container">
          ${this.generateHeader()}
          
          <div class="document-title">Payment Receipt</div>
          <div class="document-number">#${this.data.receiptNumber}</div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Billed To</div>
              <div class="info-value">
                ${this.generateCustomerInfo(this.data.customer)}
              </div>
            </div>
            <div class="info-block" style="text-align: right;">
              <div class="info-label">Receipt Details</div>
              <div class="info-value">
                <strong>Date:</strong> ${new Date(this.data.date).toLocaleDateString()}<br>
                <strong>Payment Method:</strong> ${this.data.paymentMethod}
              </div>
            </div>
          </div>
          
          <div class="amount-section">
            <div class="amount-label">AMOUNT PAID</div>
            <div class="amount-value">$${this.data.amount.toLocaleString()}</div>
          </div>
          
          <table class="details-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Service/Product</td>
                <td style="text-align: center;">${this.data.items}</td>
                <td style="text-align: right;">$${this.data.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <div style="display: inline-block; text-align: left;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; margin-right: 40px;">Subtotal:</span>
                <strong style="color: #1f2937;">$${this.data.amount.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e5e7eb; font-size: 18px;">
                <span style="color: #1f2937; font-weight: 600; margin-right: 40px;">Total:</span>
                <strong style="color: ${this.brandColor};">$${this.data.amount.toLocaleString()}</strong>
              </div>
              <div style="margin-top: 12px;">
                <span class="status-badge ${this.getStatusBadgeClass()}">${this.data.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          ${this.generateFooter('support@orizon.com', 'Thank you for your business!')}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Print receipt
   */
  printReceipt(): void {
    this.print();
  }

  /**
   * Download receipt
   */
  downloadReceipt(): void {
    this.download(`receipt-${this.data.receiptNumber}.html`);
  }
}

/**
 * Quotation Generator Class
 * Generates branded quotation documents
 */
export class QuotationGenerator extends BaseDocumentGenerator {
  private data: QuotationData;

  constructor(data: QuotationData) {
    super();
    this.data = data;
  }

  /**
   * Get status badge CSS class
   */
  private getStatusBadgeClass(): string {
    const statusClasses = {
      draft: 'status-draft',
      sent: 'status-sent',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      expired: 'status-expired'
    };
    return statusClasses[this.data.status];
  }

  /**
   * Get quotation-specific styles
   */
  private getQuotationStyles(): string {
    return `
      .status-badge { 
        display: inline-block; 
        padding: 6px 16px; 
        border-radius: 20px; 
        font-size: 12px; 
        font-weight: 600; 
        text-transform: uppercase; 
      }
      .status-draft { background: #f3f4f6; color: #374151; }
      .status-sent { background: #dbeafe; color: #1e40af; }
      .status-accepted { background: #d1fae5; color: #065f46; }
      .status-rejected { background: #fee2e2; color: #991b1b; }
      .status-expired { background: #fef3c7; color: #92400e; }
      .validity-box { 
        background: #fef3c7; 
        border-left: 4px solid #f59e0b; 
        padding: 16px; 
        margin: 30px 0; 
        border-radius: 8px; 
      }
      .validity-text { 
        color: #92400e; 
        font-size: 14px; 
        font-weight: 600; 
      }
    `;
  }

  /**
   * Generate complete quotation HTML
   */
  generateHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Quotation ${this.data.quotationNumber}</title>
        <style>
          ${this.getBaseStyles()}
          ${this.getQuotationStyles()}
        </style>
      </head>
      <body>
        <div class="document-container">
          ${this.generateHeader()}
          
          <div class="document-title">Quotation</div>
          <div class="document-number">#${this.data.quotationNumber}</div>
          
          <div class="info-section">
            <div class="info-block">
              <div class="info-label">Quotation For</div>
              <div class="info-value">
                ${this.generateCustomerInfo(this.data.customer)}
              </div>
            </div>
            <div class="info-block" style="text-align: right;">
              <div class="info-label">Quotation Details</div>
              <div class="info-value">
                <strong>Date:</strong> ${new Date(this.data.createdDate).toLocaleDateString()}<br>
                <strong>Valid Until:</strong> ${new Date(this.data.validUntil).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div class="validity-box">
            <p class="validity-text">⚠️ This quotation is valid until ${new Date(this.data.validUntil).toLocaleDateString()}</p>
          </div>
          
          <div class="amount-section">
            <div class="amount-label">QUOTED AMOUNT</div>
            <div class="amount-value">$${this.data.amount.toLocaleString()}</div>
          </div>
          
          <table class="details-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Service/Product Package</td>
                <td style="text-align: center;">${this.data.items}</td>
                <td style="text-align: right;">$${this.data.amount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="text-align: right; margin-top: 20px;">
            <div style="display: inline-block; text-align: left;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; margin-right: 40px;">Subtotal:</span>
                <strong style="color: #1f2937;">$${this.data.amount.toLocaleString()}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 2px solid #e5e7eb; font-size: 18px;">
                <span style="color: #1f2937; font-weight: 600; margin-right: 40px;">Total:</span>
                <strong style="color: ${this.brandColor};">$${this.data.amount.toLocaleString()}</strong>
              </div>
              <div style="margin-top: 12px;">
                <span class="status-badge ${this.getStatusBadgeClass()}">${this.data.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
          
          ${this.generateFooter('sales@orizon.com', 'Thank you for considering Orizon!')}
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Print quotation
   */
  printQuotation(): void {
    this.print();
  }

  /**
   * Download quotation
   */
  downloadQuotation(): void {
    this.download(`quotation-${this.data.quotationNumber}.html`);
  }
}

/**
 * Document Generator Factory
 * Factory pattern to create appropriate document generators
 */
export class DocumentGeneratorFactory {
  /**
   * Create a receipt generator
   */
  static createReceiptGenerator(data: ReceiptData): ReceiptGenerator {
    return new ReceiptGenerator(data);
  }

  /**
   * Create a quotation generator
   */
  static createQuotationGenerator(data: QuotationData): QuotationGenerator {
    return new QuotationGenerator(data);
  }
}

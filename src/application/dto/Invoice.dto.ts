

export type InvoiceStatus = 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id?: string;
  invoiceId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string;
  number: string;
  bookingId: string;
  guestId: string;
  hotelId: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  description?: string;
  items?: InvoiceItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;

  guestName?: string;
  hotelName?: string;
  bookingCode?: string;
}

export interface InvoiceCreateRequest {
  bookingId: string;
  guestId: string;
  hotelId: string;
  amount: number;
  taxAmount?: number;
  dueDate: string;
  description?: string;
  items?: Omit<InvoiceItem, 'id' | 'invoiceId'>[];
  notes?: string;
}

export interface InvoiceUpdateRequest {
  amount?: number;
  taxAmount?: number;
  totalAmount?: number;
  status?: InvoiceStatus;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: string;
  description?: string;
  notes?: string;
}

export interface InvoicePayRequest {
  paymentMethod: string;
  paymentDate?: string;
  notes?: string;
}


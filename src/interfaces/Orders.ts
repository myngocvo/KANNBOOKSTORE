export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  address: string;
  description: string | null;
  unitPrice: number;
  quantity: number;
  bookId: string;
  billId:string;
}
export interface ShoppingCartItem {
  status:number,
  description: string;
  image0: string[];
  title: string[];
  price: number[];
  quantity: number[];
  bookIds: string[];
}
export interface BillWithCustomer {
  id: string;
  userId: string | null;
  nameUser: string | null;
  voucherId: string | null;
  billDate: Date | null;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  code_pay: string | null;
  customerId: string;
  nameCustomer: string;
  phoneNumber: string;
  orderDate: Date;
  address: string;
  description: string;
  unitPrice: number;
  quantity: number;
  bookId: string;
  nameBook: string;
}


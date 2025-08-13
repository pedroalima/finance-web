export interface Transaction {
  id: number;
  amount: number;
  type_id: number;
  date: string;
  description: string;
  account_id: number;
  category_id: number;
  installment: boolean;
  installment_number?: number | null;
}

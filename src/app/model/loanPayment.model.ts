export interface LoanPayment {
  id: string;
  user_id: string;
  group_id: string;
  loan_id: string;
  amount: string;
  note_title: string;
  note_description: string;
  created_at: string;
  payment_method: string;
  status: string;
}

export interface Loan {
  id: string;
  user_id: string;
  group_id: string;
  loan_amount: string;
  tenure: string;
  start_date: string;
  end_date: string;
  contact_number: string;
  loan_type: string;
  interest_rate: string;
  loan_emi: string;
  total_payment: string;
  interest_payable: string;
  gurarantor: string;
  gurarantor_first_name: string;
  gurarantor_last_name: string;
  gurarantor_email: string;
  status: string;
  created_at: string;
  paid_amount: string;
  sno: number;
}

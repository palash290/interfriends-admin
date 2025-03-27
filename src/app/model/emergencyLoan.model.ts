export interface EmergencyLoan {
  id: string;
  user_id: string;
  group_id: string;
  loan_amount: string;
  pay_by: string;
  contact_number: string;
  gurarantor: string;
  active_date: string;
  complete_date: string;
  status: string;
  payment_method: string;
  paid_status: string;
  created_at: string;
  gurarantor_first_name: string;
  gurarantor_last_name: string;
  gurarantor_email: string;
  sno: number;
}

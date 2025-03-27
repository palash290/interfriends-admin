export interface Investment {
  id: string;
  user_id: string;
  group_id: string;
  property_id: string;
  amount: string;
  investment_type: string;
  description: string;
  status: string;
  created_at: string;
  sno: number;
  property_info: any;
  payment_status: string;
  payment_method: string;
  note_title: string;
  note_description: string;
}

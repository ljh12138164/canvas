export type Form = {
  id: string;
  name: string;
  inviteCode: string;
  description: string;
  userId: string;
  created_at: Date;
  update_at: Date;
  schema: string;
};

export interface SumbitForm {
  create_at: string;
  formId: string;
  id: string;
  userId: string;
  submit: string;
  inviteCode: string;
}

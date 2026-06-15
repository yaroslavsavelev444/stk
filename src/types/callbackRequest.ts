
export type RequestStatus = 'new' | 'processing' | 'completed';

export interface ICallbackRequest {
  name?: string;
  phone: string;
  email?: string;
  comment?: string;
  status: RequestStatus;
}
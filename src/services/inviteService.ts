import api from '../lib/api';
import { inviteStorage } from './authService';

export type InviteValidationResponse = {
  email: string;
  teamId: string;
  teamName: string;
  managerName: string;
  expiresAt: string;
  hasAccount: boolean;
};

export const validateInviteToken = async (token: string): Promise<InviteValidationResponse> => {
  const response = await api.get(`/invites/validate/${token}`);
  return response.data.invite as InviteValidationResponse;
};

export const savePendingInviteToken = (token: string) => {
  inviteStorage.save(token);
};

export const getPendingInviteToken = () => inviteStorage.get();

export const clearPendingInviteToken = () => {
  inviteStorage.clear();
};

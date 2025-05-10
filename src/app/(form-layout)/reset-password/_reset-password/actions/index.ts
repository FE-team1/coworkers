import axiosClient from '@/lib/axiosClient';
import { PasswordForm } from '../types/form-data-type';

export const submitResetPassword = async (
  token: string | string[] | undefined,
  formData: PasswordForm
) => {
  await axiosClient.patch(`/user/reset-password`, {
    token: token,
    ...formData,
  });
};

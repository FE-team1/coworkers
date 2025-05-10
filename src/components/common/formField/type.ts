import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  borderClassName?: string;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  rightSlot?: React.ReactNode;
  height?: number;
  isBorder?: boolean;
  className?: string;
}

export type ImageUploaderType = 'board' | 'team' | 'user';

export interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
  imageUploaderType?: ImageUploaderType;
  image: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormFieldProps {
  field: 'input' | 'textarea' | 'file-input';
  imageUploaderType?: ImageUploaderType;
  label?: string;
  required?: boolean;
  isSuccess?: boolean;
  isFailure?: boolean;
  isSubmit?: boolean;
  errorMessage?: string;
  gapSize?: '12' | '16' | '24' | '32';
  labelSize?: '16/16' | '14/16' | '16/20';
  onFieldFocus?: () => void;
  onFieldBlur?: () => void;
}

export type FieldComponentProps =
  | (InputProps & FormFieldProps & { field?: 'input' })
  | (TextareaProps & FormFieldProps & { field?: 'textarea' })
  | (FileInputProps & FormFieldProps & { field?: 'file-input' });

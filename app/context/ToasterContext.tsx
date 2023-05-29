'use client'
import type { FC } from 'react';
import { Toaster } from 'react-hot-toast';

interface ToastContextProps { }

const ToastContext: FC<ToastContextProps> = () => {
  return (
    <Toaster />
  );
}

export default ToastContext;

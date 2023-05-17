import type { FC } from 'react';
import { VscRefresh } from 'react-icons/vsc';

interface LoadingSpinnerProps {
  big?: boolean
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({ big }) => {
  return <div className="flex justify-center p-2">
    <VscRefresh className={`animate-spin ${big ? `w-16 h-16` : `w-10 h-10`}`} />
  </div>
}

export default LoadingSpinner;

import LoadingModal from '@/app/components/LoadingModal';
import type { FC } from 'react';

interface LoadingProps { }

const Loading: FC<LoadingProps> = () => {
  return (<LoadingModal />);
}

export default Loading;

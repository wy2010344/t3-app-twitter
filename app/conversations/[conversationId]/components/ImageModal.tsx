import Modal from '@/app/components/Modal';
import Image from 'next/image';
import type { FC } from 'react';

interface ImageModalProps {
  src: string
  isOpen: boolean
  onClose(): void
}

const ImageModal: FC<ImageModalProps> = ({
  src,
  isOpen,
  onClose
}) => {
  return (<Modal isOpen={isOpen} onClose={onClose}>
    <div className="w-80 h-80 relative">
      <Image alt='Image' className='object-cover' fill src={src} />
    </div>
  </Modal>);
}

export default ImageModal;

import type { FC } from 'react';
import Image from 'next/image'
import { VscAccount } from 'react-icons/vsc';
interface ProfileImageProps {
  className?: string
  src?: string | null
}

const ProfileImage: FC<ProfileImageProps> = ({ className = '', src }) => {
  return (<div
    className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}
  >
    {src ? <Image src={src} alt="Profile Image" quality={100} fill /> : <VscAccount className='h-full w-full' />}
  </div>);
}

export default ProfileImage;

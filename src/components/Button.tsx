import type { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  small?: boolean
  gray?: boolean
}

const Button: FC<ButtonProps> = ({
  small,
  gray,
  className = '',
  ...props
}) => {
  return (<button
    className={`${className} 
    rounded-full transition-colors duration-200 disabled:cursor-not-allowed
    disabled:opacity-50 text-white
    ${small
        ? 'px-2 py-1'
        : 'px-4 py-2 font-bold'}
    ${gray
        ? 'bg-gray-400 hover:bg-gray-300 focus-visible:bg-gray-300'
        : 'bg-blue-500 hover:bg-blue-400 focus-visible:bg-blue-400'}
    `}
    {...props} />);
}

export default Button;

import type { FC } from 'react';
import { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import ReactSelect from 'react-select';


type Option = {
  label: string
  value: string
}
interface SelectProps {

  label: string
  required?: boolean
  disabled?: boolean
  options: Option[]
  value: Option[]
  onChange(v: Option[]): void
}

function Select({
  label,
  disabled,
  options,
  onChange,
  value
}: SelectProps) {
  return (<div className='z-[100]'>
    <label htmlFor="" className="block text-sm font-medium leading-6 text-gray-900">
      {label}
    </label>
    <div className="mt-2">
      <ReactSelect
        isDisabled={disabled}
        value={value}
        onChange={onChange as any}
        isMulti
        options={options as any}
        menuPortalTarget={document.body}
        styles={{
          menuPortal(base, props) {
            return {
              ...base,
              zIndex: 9999
            }
          },
        }}
        classNames={{
          control() {
            return 'text-sm'
          }
        }}
      />
    </div>
  </div>);
}

export default Select;

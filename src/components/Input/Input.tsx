import React from 'react';
import './input.css';

export interface InputProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * input id
   */
  id?: string;
  /**
   * input label
   */
  label: string;
  /**
   * input state
   */
  disabled?: boolean;
  /**
   * input type
   */
  type?: string;
  /**
   * input value
   */
  value?: string | number;
  /**
   * input value
   */
  step?: number;
  /**
   * Optional click handler
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Primary UI component for user interaction
 */
const Input: React.FC<InputProps> = ({
  primary = true,
  id,
  label,
  disabled = false,
  type,
  value,
  ...props
}) => {
  const mode = primary
    ? 'chlela-input__field--primary'
    : 'chlela-input__field--warning';

  return (
    <div className="chlela-input">
      <label htmlFor={id} className="chlela-input__label">
        {' '}
        {label}{' '}
      </label>
      <input
        className={['chlela-input__field', mode].join(' ')}
        id={id}
        type={type}
        value={value}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default Input;

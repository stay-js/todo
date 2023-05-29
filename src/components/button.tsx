export const Button: React.FC<{
  onClick?: () => void;
  color?: 'red' | 'green';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, color = 'green', type = 'button', className = '', disabled, children }) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`h-fit w-fit whitespace-nowrap rounded border-2 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent
      ${
        color === 'red'
          ? 'border-red-500 bg-red-500 hover:text-red-500'
          : 'border-green-500 bg-green-500 hover:text-green-500'
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

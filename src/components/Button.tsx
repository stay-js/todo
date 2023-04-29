export const Button: React.FC<{
  onClick?: () => void;
  variant?: 'red' | 'green';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}> = ({ onClick, variant = 'green', type = 'button', children }) => {
  return (
    <button
      type={type}
      className={`whitespace-nowrap rounded border-2 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent
      ${
        variant === 'red'
          ? 'border-red-500 bg-red-500 hover:text-red-500'
          : 'border-green-500 bg-green-500 hover:text-green-500'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

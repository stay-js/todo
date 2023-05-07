import { TbAlertCircle } from 'react-icons/tb';

export const Error: React.FC<{ size?: number }> = ({ size = 48 }) => (
  <div className="flex flex-col items-center gap-2">
    <TbAlertCircle size={size} color="red" className="animate-bounce" />
    <span className="text-lg font-bold">Something went wrong... try again later!</span>
  </div>
);

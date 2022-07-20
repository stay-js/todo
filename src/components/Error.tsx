import { TbAlertCircle } from 'react-icons/tb';

const Error: React.FC = () => (
  <div className="flex flex-col items-center gap-2 my-4">
    <TbAlertCircle size={48} color="red" className="animate-bounce" />
    Something went wrong... try again later!
  </div>
);

export default Error;

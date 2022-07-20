import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

const SignIn: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center w-screen gap-4"
    style={{
      height: 'calc(100vh - 4.5rem)',
    }}
  >
    <h1 className="mx-4 text-2xl font-bold text-center">
      In order to use the application please sign in.
    </h1>

    <button
      type="button"
      className="text-white bg-[#24292F] hover:bg-[#24292F]/90 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center gap-2"
      onClick={() => signIn('github')}
    >
      <FaGithub size={18} />
      Sign in with Github
    </button>
  </div>
);

export default SignIn;

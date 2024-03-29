import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSession, signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';
import { Meta } from '~/components/meta';

const Page: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  if (session) void router.push('/');

  return (
    <>
      <Meta path="/sign-in" title="Sign In - Todo" description="Sign In - Todo" />

      <main className="mx-auto flex w-11/12 flex-col items-center justify-center gap-4">
        <h1 className="text-center text-2xl font-bold">
          In order to use the application please sign in...
        </h1>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#24292F] px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-[#24292F]/90"
          onClick={() =>
            signIn('github', {
              callbackUrl: Array.isArray(router.query.callbackUrl)
                ? router.query.callbackUrl[0]
                : router.query.callbackUrl ?? '/',
            })
          }
        >
          <FaGithub size={18} />
          Sign in with Github
        </button>
      </main>
    </>
  );
};

export default Page;

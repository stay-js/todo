import type { Todo } from '@prisma/client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/future/image';
import { useEffect, useState } from 'react';
import { TbSelector } from 'react-icons/tb';
import trpc from '@utils/trpc';
import Error from '../Error';

const validate = (value: string): string | null => {
  let error: string | null = null;

  if (!value) error = 'Please specify a todo!';
  if (value.length > 200) error = 'Length should be between 0 and 200!';

  return error;
};

const Content: React.FC = () => {
  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');

  const { data: session } = useSession();
  const {
    mutate: fetchTodos,
    isError,
    isLoading,
  } = trpc.useMutation(['todo.get'], {
    onSuccess: (data) => setTodos(data),
  });

  const { mutate: createTodo } = trpc.useMutation(['todo.create'], {
    onSettled: () => fetchTodos({ order }),
  });

  const { mutate: deleteTodo } = trpc.useMutation(['todo.delete'], {
    onSettled: () => fetchTodos({ order }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newError = validate(value);
    setError(newError);

    if (!newError) {
      createTodo({ body: value });
      setValue('');
    }
  };

  useEffect(() => {
    fetchTodos({ order });
  }, [fetchTodos, order]);

  return (
    <>
      <div className="relative flex items-center py-4 after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-neutral-700">
        <div className="flex w-full items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <Image
                className="select-none rounded-full"
                src={session.user.image}
                alt="GitHub Profile Picture"
                width={48}
                height={48}
              />
            )}
            <p className="text-lg">
              Hi, <span className="font-semibold">{session?.user?.name}!</span>
            </p>
          </div>

          <button
            type="button"
            className="rounded border-2 border-solid border-green-500 bg-green-500 px-4 py-2 text-white transition-all hover:bg-transparent hover:text-green-500"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>

      <main className="mx-auto mt-8 max-w-[90%]">
        <div className="mx-auto mb-4 flex max-w-2xl flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">Order Todos:</p>
            <div className="relative flex items-center rounded border border-[#373A40] bg-[#25262b] text-sm text-neutral-300">
              <select
                className="h-10 w-full appearance-none bg-transparent pl-2 pr-8"
                value={order}
                onChange={(event) => setOrder(event.target.value as 'desc' | 'asc')}
              >
                <option value="desc">Latest first</option>
                <option value="asc">Oldest first</option>
              </select>

              <TbSelector
                size={16}
                className="pointer-events-none absolute right-2 text-neutral-300"
              />
            </div>
          </div>

          {isError && <Error />}
          {!todos && isLoading && (
            <svg className="mx-auto my-4 h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="stroke-green-500 opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="fill-green-500"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}

          <div className="flex max-h-[60vh] flex-col gap-4 overflow-auto" ref={parent}>
            {todos?.map(({ id, body }) => (
              <div
                key={id}
                className="flex items-center justify-between gap-2 rounded bg-neutral-800 px-6 py-4"
              >
                {body}
                <button
                  type="button"
                  className="whitespace-nowrap rounded border-2 border-solid border-red-500 bg-red-500 px-2 py-1 text-white transition-all hover:bg-transparent hover:text-red-500"
                  onClick={() => deleteTodo({ id })}
                >
                  Delete <span className="hidden sm:inline-block">Todo</span>
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex w-full justify-between gap-2">
            <div className="flex w-full flex-col gap-1">
              <input
                type="text"
                className="h-10 w-full rounded border border-[#373A40] bg-[#25262b] px-2 text-sm text-neutral-400"
                placeholder="Create new todo:"
                id="body"
                value={value}
                onChange={(event) => setValue(event.currentTarget.value)}
              />

              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>

            <input
              className="h-10 cursor-pointer rounded bg-green-500 px-4 text-sm font-bold text-white shadow-sm transition-colors duration-300 hover:bg-neutral-700 focus:bg-neutral-700"
              type="submit"
              value="Create"
            />
          </form>
        </div>
      </main>
    </>
  );
};

export default Content;

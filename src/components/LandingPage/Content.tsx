import { Loader, TextInput, NativeSelect } from '@mantine/core';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import trpc from '../../utils/trpc';
import Error from '../Error';

const validate = (value: string): string | null => {
  let error: string | null = null;

  if (!value) error = 'Please specify a todo!';
  if (value.length > 200) error = 'Length should be between 0 and 200!';

  return error;
};

const Content: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState<string>('');
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');

  const { data: session } = useSession();
  const { mutate: fetchTodos, data, isError, isLoading } = trpc.useMutation(['todo.get']);

  const { mutate: createTodo } = trpc.useMutation(['todo.create'], {
    onSettled() {
      fetchTodos({ order });
    },
  });

  const { mutate: deleteTodo } = trpc.useMutation(['todo.delete'], {
    onSettled() {
      fetchTodos({ order });
    },
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
      <div className="relative flex items-center py-4 after:absolute after:block after:bg-neutral-700 after:w-full after:h-[1px] after:bottom-0 after:left-0">
        <div className="flex items-center justify-between w-full content">
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <Image
                src={session.user?.image}
                alt="GitHub Profile Picture"
                width={48}
                height={48}
                className="rounded-full select-none"
              />
            )}
            <p className="text-lg">
              Hi, <span className="font-semibold">{session?.user?.name}!</span>
            </p>
          </div>

          <button
            type="button"
            className="px-4 py-2 text-white transition-all bg-green-500 border-2 border-green-500 border-solid rounded hover:text-green-500 hover:bg-transparent"
            onClick={() => signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>

      <main className="mt-8 content">
        {isError && <Error />}
        {isLoading && <Loader className="mx-auto my-4" />}

        <div className="flex flex-col max-w-2xl gap-4 mx-auto mb-4">
          <div className="flex items-center justify-between">
            <p className="font-bold">Order Todos:</p>
            <NativeSelect
              className="select-none w-fit"
              data={[
                { value: 'desc', label: 'Latest first' },
                { value: 'asc', label: 'Oldest first' },
              ]}
              value={order}
              onChange={(event) => setOrder(event.target.value as 'desc' | 'asc')}
            />
          </div>
          <div className="flex flex-col gap-4 max-h-[60vh] overflow-auto">
            {data &&
              data.map(({ id, body }) => (
                <div
                  key={id}
                  className="flex items-center justify-between gap-2 px-6 py-4 rounded bg-neutral-800"
                >
                  {body}
                  <button
                    type="button"
                    className="px-2 py-1 text-white transition-all bg-red-500 border-2 border-red-500 border-solid rounded whitespace-nowrap hover:text-red-500 hover:bg-transparent"
                    onClick={() => deleteTodo({ id })}
                  >
                    Delete <span className="hidden sm:inline-block">Todo</span>
                  </button>
                </div>
              ))}
          </div>

          <form onSubmit={handleSubmit} className="flex justify-between w-full gap-2">
            <TextInput
              className="w-full"
              placeholder="Create new todo:"
              id="body"
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              error={error}
            />

            <input
              className="px-4 text-sm font-bold text-white transition-colors duration-300 bg-green-500 rounded shadow-sm cursor-pointer h-9 hover:bg-neutral-700 focus:bg-neutral-700"
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

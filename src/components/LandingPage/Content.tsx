import Image from 'next/image';
import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Loader, TextInput } from '@mantine/core';
import trpc from '../../utils/trpc';
import Error from '../../components/Error';

import type InputEvent from '../../interfaces/InputEvent.interface';
import type { TodoProps as Props, TodoErrors as Errors } from '../../interfaces/Todo.interface';

const defaultValues: Props = { body: '' };

const validate = (values: Props): Errors => {
  const errors: Errors = {};

  if (!values.body) errors.body = 'Please specify a todo!';

  return errors;
};

const Content: React.FC = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [values, setValues] = useState<Props>(defaultValues);

  const { data: session } = useSession();
  const { mutate: fetchTodos, data, isError, isLoading } = trpc.useMutation(['todo.get-todos']);

  const { mutate: createTodo } = trpc.useMutation(['todo.create'], {
    onSettled() {
      fetchTodos();
    },
  });

  const { mutate: deleteTodo } = trpc.useMutation(['todo.delete'], {
    onSettled() {
      fetchTodos();
    },
  });

  const handleChange = ({ key, value }: InputEvent) => setValues({ ...values, [key]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      createTodo(values);
      setValues(defaultValues);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
        {isLoading && <Loader className="mx-auto" />}

        <div className="flex flex-col max-w-2xl gap-4 mx-auto">
          {data &&
            data.map(({ id, body }) => (
              <div
                key={id}
                className="flex items-center justify-between px-6 py-4 rounded bg-neutral-800"
              >
                {body}
                <button
                  type="button"
                  className="px-2 py-1 text-white transition-all bg-red-500 border-2 border-red-500 border-solid rounded h-fit hover:text-red-500 hover:bg-transparent"
                  onClick={() => deleteTodo({ id })}
                >
                  Delete Todo
                </button>
              </div>
            ))}

          <form onSubmit={handleSubmit} className="flex justify-between w-full gap-2">
            <TextInput
              className="w-full"
              placeholder="Create new todo:"
              id="body"
              value={values.body}
              onChange={(event) => handleChange({ key: 'body', value: event.currentTarget.value })}
              error={errors.body}
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

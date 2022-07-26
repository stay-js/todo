import type { Todo } from '@prisma/client';
import { useEffect, useState, useRef, Fragment } from 'react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Dialog, Transition } from '@headlessui/react';
import { TbAlertCircle, TbSelector } from 'react-icons/tb';
import { trpc } from '@utils/trpc';

export const Content: React.FC = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [order, setOrder] = useState<'desc' | 'asc'>('desc');
  const [error, setError] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  const [parent] = useAutoAnimate<HTMLDivElement>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: session } = useSession();

  const {
    mutate: fetchTodos,
    isError,
    isLoading,
  } = trpc.todo.get.useMutation({
    onSuccess: (data) => setTodos(data),
  });

  const { mutate: createTodo } = trpc.todo.create.useMutation({
    onSettled: () => fetchTodos({ order }),
  });

  const { mutate: deleteTodo } = trpc.todo.delete.useMutation({
    onSettled: () => fetchTodos({ order }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const value = inputRef.current?.value;

    if (!value) return setError('Please specify a todo!');
    if (value.length > 200) return setError('Length should be between 0 and 200!');

    setError(null)
    inputRef.current.value = '';
    createTodo({ body: value });
  };

  const handleOpenPopup = (id: string) => {
    setTodoToDelete(id);
    setIsPopupOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTodo({ id });
    setIsPopupOpen(false);
    setTodoToDelete(null);
  };

  useEffect(() => {
    fetchTodos({ order });
  }, [fetchTodos, order]);

  return (
    <>
      <Transition appear show={isPopupOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsPopupOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>

          <div className="fixed inset-0 grid place-items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex w-11/12 max-w-md flex-col gap-4 rounded-2xl bg-neutral-900 p-6 shadow-xl">
                <div className="flex flex-col gap-2">
                  <Dialog.Title className="text-lg font-bold text-neutral-50">
                    Delete Todo
                  </Dialog.Title>

                  <Dialog.Description className="m-0 text-sm text-neutral-200">
                    Are you sure you want to delete this Todo? This action <b>cannot be undone</b>.
                    This will <b>permanently</b> delete the selected Todo.
                  </Dialog.Description>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded border-2 border-green-500 bg-green-500 py-2 px-4 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-green-500"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="rounded border-2 border-red-500 bg-red-500 py-2 px-4 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-red-500"
                    onClick={() => handleDelete(todoToDelete!)}
                  >
                    Delete <span className="hidden sm:inline-block">Todo</span>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="relative flex items-center justify-between px-6 py-4 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-neutral-700">
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
            Hi, <span className="font-bold">{session?.user?.name}!</span>
          </p>
        </div>

        <button
          type="button"
          className="rounded border-2 border-green-500 bg-green-500 py-2 px-4 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-green-500"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
      </div>

      <main className="mx-auto flex w-11/12 max-w-2xl flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <p className="font-bold">Order Todos:</p>
          <div className="relative flex items-center rounded border border-[#373A40] bg-[#25262b] text-sm text-neutral-300">
            <select
              className="h-10 w-full appearance-none bg-transparent pl-2 pr-8"
              value={order}
              onChange={(e) => setOrder(e.target.value as 'desc' | 'asc')}
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

        {isError && (
          <div className="flex flex-col items-center gap-2">
            <TbAlertCircle size={48} color="red" className="animate-bounce" />
            Something went wrong... try again later!
          </div>
        )}

        {!todos && isLoading && (
          <svg className="mx-auto h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24">
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
                className="whitespace-nowrap rounded border-2 border-red-500 bg-red-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-red-500"
                onClick={() => handleOpenPopup(id)}
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
              ref={inputRef}
            />

            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <input
            className="h-10 rounded border-2 border-green-500 bg-green-500 px-4 text-sm font-bold text-white transition-all hover:bg-transparent hover:text-green-500"
            type="submit"
            value="Create"
          />
        </form>
      </main>
    </>
  );
};

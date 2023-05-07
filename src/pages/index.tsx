import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import type { Todo } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState, useRef, Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Dialog, Transition } from '@headlessui/react';
import { TbSelector } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { Button } from '@components/Button';
import { SignIn } from '@components/SignIn';
import { Error, LoadingSpinner } from '@components/States';

type Order = 'desc' | 'asc';

const Todos: React.FC<{ order: Order }> = ({ order }) => {
  const [todos, setTodos] = useState<Todo[] | null | undefined>(null);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const { refetch, isError, isLoading } = trpc.todos.getAll.useQuery(
    { order },
    { onSettled: (data) => setTodos(data) },
  );

  const { mutate: deleteTodo } = trpc.todos.delete.useMutation({
    onMutate: () => setTodoToDelete(null),
    onSuccess: () => refetch(),
    onError: () => toast.error('Failed to delete Todo! Please try again later.'),
  });

  if (isLoading) {
    return (
      <div className="py-6">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) return <Error />;

  return (
    <>
      <Transition appear show={!!todoToDelete} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setTodoToDelete(null)}>
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
                  <Button onClick={() => setTodoToDelete(null)}>Cancel</Button>

                  <Button color="red" onClick={() => deleteTodo({ id: todoToDelete as string })}>
                    Delete <span className="hidden sm:inline-block">Todo</span>
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="flex max-h-[60vh] flex-col gap-4 overflow-auto" ref={parent}>
        {todos?.map(({ id, body }) => (
          <div
            key={id}
            className="flex items-center justify-between gap-2 rounded bg-neutral-800 px-6 py-4"
          >
            <span>{body}</span>

            <Button color="red" onClick={() => setTodoToDelete(id)}>
              Delete <span className="hidden sm:inline-block">Todo</span>
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

const Feed: React.FC<{ session: Session }> = ({ session }) => {
  const [order, setOrder] = useState<Order>('desc');

  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = trpc.useContext();

  const { mutate: createTodo, isLoading: isCreatingTodo } = trpc.todos.create.useMutation({
    onSuccess: () => ctx.todos.getAll.invalidate(),
    onError: () => toast.error('Failed to create Todo! Please try again later.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    createTodo({ body: inputRef.current.value });
    inputRef.current.value = '';
  };

  useEffect(() => {
    void ctx.todos.getAll.invalidate();
  }, [ctx, order]);

  return (
    <main>
      <div className="relative flex items-center justify-between px-6 py-4 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-neutral-700">
        <div className="flex items-center gap-4">
          {session.user?.image && (
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

        <Button onClick={() => void signOut()}>Sign Out</Button>
      </div>

      <div className="mx-auto flex w-11/12 max-w-2xl flex-col gap-4 py-4">
        <div className="flex items-center justify-between">
          <p className="font-bold">Order Todos:</p>
          <div className="relative flex items-center rounded border border-[#373A40] bg-[#25262b] text-sm text-neutral-300">
            <select
              className="h-10 w-full appearance-none bg-transparent pl-2 pr-8"
              value={order}
              onChange={(e) => setOrder(e.target.value as Order)}
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

        <Todos order={order} />

        <form onSubmit={handleSubmit} className="flex w-full items-center justify-between gap-2">
          <input
            required
            type="text"
            maxLength={200}
            className="h-10 w-full rounded border border-[#373A40] bg-[#25262b] px-2 text-sm text-neutral-400"
            placeholder="Create new todo:"
            ref={inputRef}
            disabled={isCreatingTodo}
          />

          <Button type="submit" disabled={isCreatingTodo}>
            {isCreatingTodo ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </div>
    </main>
  );
};
const Page: NextPage = () => {
  const { data: session } = useSession();

  return (
    <>
      <Meta path="/" title="Todo" description="Todo App with GitHub authentication." />

      {session ? <Feed session={session} /> : <SignIn />}
    </>
  );
};

export default Page;

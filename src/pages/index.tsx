import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import type { Todo } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState, useRef, Fragment } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { Dialog, Transition } from '@headlessui/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { TbAlertCircle, TbAlignJustified, TbSelector, TbX } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { Button } from '@components/Button';
import { SignIn } from '@components/SignIn';

type Order = 'desc' | 'asc';

const Todos: React.FC<{ order: Order }> = ({ order }) => {
  const [todos, setTodos] = useState<Todo[] | null | undefined>(null);
  const [selectedTodoID, setSelectedTodoID] = useState<string | null>(null);

  const currentTodo = todos?.find((todo) => todo.id === selectedTodoID);

  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const { refetch, isError, isLoading } = trpc.todos.getAll.useQuery(
    { order },
    { onSettled: (data) => setTodos(data) },
  );

  const { mutate: deleteTodo, isLoading: isDeleting } = trpc.todos.delete.useMutation({
    onSettled: () => setSelectedTodoID(null),
    onSuccess: () => refetch(),
    onError: () => toast.error('Failed to delete Todo! Please try again later.'),
  });

  const { mutate: updateTodo, isLoading: isUpdating } = trpc.todos.update.useMutation({
    onSuccess: () => refetch(),
    onError: () => toast.error('Failed to update Todo! Please try again later.'),
  });

  const onTodoUpdate = () => {
    if (!currentTodo || !titleRef.current || !descriptionRef.current) return;

    updateTodo({
      ...currentTodo,
      title: titleRef.current?.value.trim(),
      description: descriptionRef.current?.value.trim(),
    });
  };

  if (!todos && isLoading) {
    return (
      <div className="py-6">
        <svg className="mx-auto h-8 w-8 animate-spin fill-none" viewBox="0 0 24 24">
          <circle className="stroke-green-500 stroke-[4] opacity-25" cx="12" cy="12" r="10" />
          <path
            className="fill-green-500"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    );
  }

  if (isError)
    return (
      <div className="flex flex-col items-center gap-2">
        <TbAlertCircle size={48} color="red" className="animate-bounce" />
        <span className="text-lg font-bold">Something went wrong... try again later!</span>
      </div>
    );

  return (
    <>
      <Transition appear show={!!currentTodo} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          initialFocus={descriptionRef}
          onClose={() => setSelectedTodoID(null)}
        >
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
              <Dialog.Panel className="flex w-11/12 max-w-3xl flex-col gap-4 rounded-2xl bg-neutral-900 p-6 shadow-xl">
                <div className="flex flex-col gap-2">
                  <Dialog.Title className="flex items-center justify-between gap-4 text-lg font-bold text-neutral-50">
                    <input
                      required
                      type="text"
                      className="w-full rounded bg-transparent px-1 py-2 text-lg font-semibold"
                      maxLength={200}
                      defaultValue={currentTodo?.title}
                      ref={titleRef}
                    />

                    <button
                      type="button"
                      title="Close"
                      className="rounded-full p-1.5 transition-colors hover:bg-neutral-700"
                      onClick={() => setSelectedTodoID(null)}
                    >
                      <TbX size={24} />
                    </button>
                  </Dialog.Title>

                  <Dialog.Description className="m-0 grid gap-4 pt-4 text-sm text-neutral-200 sm:grid-cols-[3fr_1fr]">
                    <div className="flex flex-col gap-2">
                      <h3 className="flex items-center gap-2 text-base font-semibold">
                        <TbAlignJustified size={26} className="inline-block" />
                        Description
                      </h3>
                      <textarea
                        className="w-full resize-none rounded-xl bg-zinc-800 p-3 text-sm font-normal"
                        placeholder="Add detailed description here..."
                        rows={15}
                        maxLength={2000}
                        defaultValue={currentTodo?.description ?? ''}
                        ref={descriptionRef}
                      />
                    </div>

                    {currentTodo && (
                      <div className="flex min-w-[25%] flex-col gap-2">
                        <Button
                          disabled={isDeleting || isUpdating}
                          className="flex w-full"
                          onClick={onTodoUpdate}
                        >
                          {isUpdating ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          disabled={isDeleting || isUpdating}
                          className="flex w-full"
                          onClick={() =>
                            updateTodo({ ...currentTodo, completed: !currentTodo.completed })
                          }
                        >
                          Mark as {currentTodo.completed ? 'Pending' : 'Done'}
                        </Button>
                        <Button
                          disabled={isDeleting || isUpdating}
                          color="red"
                          className="flex w-full"
                          onClick={() => deleteTodo({ id: currentTodo.id })}
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    )}
                  </Dialog.Description>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <div className="flex max-h-[60vh] flex-col gap-4 overflow-auto" ref={parent}>
        {todos?.map(({ id, title, completed }) => (
          <button
            key={id}
            type="button"
            onClick={() => setSelectedTodoID(id)}
            className="rounded bg-neutral-800 px-6 py-4 text-start"
            style={{ overflowWrap: 'anywhere' }}
          >
            {title} {completed && '- ✅'}
          </button>
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
    onError: (error) => {
      if (error.data?.code === 'TOO_MANY_REQUESTS') {
        return toast.error('You are being rate limited! Please try again later.');
      }

      toast.error('Failed to create Todo! Please try again later.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputRef.current?.value) return;

    createTodo({ title: inputRef.current.value });
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

        <Button onClick={() => signOut()}>Sign Out</Button>
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

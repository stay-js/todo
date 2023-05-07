import type { NextPage } from 'next';
import type { Session } from 'next-auth';
import type { Todo } from '@prisma/client';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { TbAlertCircle, TbSelector } from 'react-icons/tb';
import { toast } from 'react-hot-toast';
import { trpc } from '@utils/trpc';
import { Meta } from '@components/Meta';
import { Button } from '@components/Button';
import { SignIn } from '@components/SignIn';
import { Popup } from '@components/Popup';

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
      <Popup
        todoToDelete={todoToDelete}
        setTodoToDelete={setTodoToDelete}
        deleteTodo={deleteTodo}
      />

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

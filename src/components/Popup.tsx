import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './Button';

export const Popup: React.FC<{
  todoToDelete: string | null;
  setTodoToDelete: (todo: string | null) => void;
  deleteTodo: (todo: { id: string }) => void;
}> = ({ todoToDelete, setTodoToDelete, deleteTodo }) => (
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
              <Dialog.Title className="text-lg font-bold text-neutral-50">Delete Todo</Dialog.Title>

              <Dialog.Description className="m-0 text-sm text-neutral-200">
                Are you sure you want to delete this Todo? This action <b>cannot be undone</b>. This
                will <b>permanently</b> delete the selected Todo.
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
);

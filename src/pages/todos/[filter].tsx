import { TodoTask } from '@prisma/client';
import { useIsMutating } from '@tanstack/react-query';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';
import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import { api } from '~/utils/api';
import { useClickOutside } from '~/utils/use-click-outside';
import { useLocale } from '~/utils/use-locale';
interface TodosPageProps {

}

const TodosPage: FC<TodosPageProps> = (arg) => {
  const router = useRouter()
  const filter = router.query.filter as string
  const { t } = useLocale()
  const utils = api.useContext()
  const allTasks = api.todo.all.useQuery(undefined, {
    //数据过时时间设置
    staleTime: 3000
  })
  const addTask = api.todo.add.useMutation({
    async onMutate({ text }) {
      await utils.todo.all.cancel()
      const tasks = allTasks.data ?? []
      utils.todo.all.setData(undefined, [
        ...tasks,
        {
          id: `${Math.random()}`,
          completed: false,
          text,
          createdAt: new Date()
        }
      ])
    },
    //为什么要先设置,而不是成功后处理
    onSuccess(data) {

    },
  })

  const clearCompleted = api.todo.clearCompleted.useMutation({
    async onMutate() {
      await utils.todo.all.cancel()
      const tasks = allTasks.data ?? []
      utils.todo.all.setData(undefined, tasks.filter(t => {
        return !t.completed
      }))
    }
  })

  const toggleAll = api.todo.toggleAll.useMutation({
    async onMutate({ completed }) {
      await utils.todo.all.cancel()
      const tasks = allTasks.data ?? []
      utils.todo.all.setData(undefined, tasks.map(t => {
        return {
          ...t,
          completed
        }
      }))
    }
  })
  const number = useIsMutating()
  //成功之后刷新数据?
  useEffect(() => {
    if (number == 0) {
      utils.todo.all.invalidate()
    }
  }, [number, utils])

  const tasksLeft = allTasks.data?.filter((t) => !t.completed).length ?? 0;
  const tasksCompleted = allTasks.data?.filter((t) => t.completed).length ?? 0;

  return (
    <>
      <Head>
        <title>Todos</title>
      </Head>
      <main className='todoapp'>
        <header className='header'>
          <h1>todos</h1>
          <input className='new-todo'
            placeholder={t('what_needs_to_be_done') as string}
            autoFocus
            onKeyDown={e => {
              if (e.key == "Enter") {
                const text = e.currentTarget.value.trim()
                if (text) {
                  addTask.mutate({ text })
                  e.currentTarget.value = ''
                }
              }
            }}
          />
          <section className='main'>
            <input id="toggle-all"
              className='toggle-all'
              type='checkbox'
              checked={tasksCompleted == allTasks.data?.length}
              onChange={e => {
                toggleAll.mutate({
                  completed: e.currentTarget.checked
                })
              }}
            />
            <label htmlFor='toggle-all'>{t('mark_all_as_complete')}</label>
            <ul className='todo-list'>
              {allTasks.data?.filter(({ completed }) => {
                return filter == 'completed'
                  ? completed
                  : filter == 'active'
                    ? !completed : true
              }).map(task => {
                return <ListItem key={task.id} task={task} />
              })}
            </ul>
          </section>
          <footer className='footer'>
            <span className='todo-count'>
              <strong>{tasksLeft}</strong>
              {tasksLeft == 1 ? t('task_left') : t('tasks_left')}
            </span>
            <ul className='filters'>
              {filters.map(thisFilter => (
                <li key={thisFilter}>
                  <Link href={`/todos/${thisFilter}`}
                    className={thisFilter == filter ? 'selected' : ''}>
                    {t(thisFilter)}
                  </Link>
                </li>
              ))}
            </ul>
            {tasksCompleted > 0 && <button
              className='clear-completed'
              onClick={() => {
                clearCompleted.mutate()
              }}>{t('clear_completed')}</button>}
          </footer>
        </header>
      </main>
    </>
  );
}

const filters = ['all', 'active', 'completed'] as const;

function ListItem({
  task
}: {
  task: TodoTask
}) {

  const [editing, setEditing] = useState(false)
  const wrapperRef = useRef(null)

  const utils = api.useContext()
  const [text, setText] = useState(task.text);
  useEffect(() => {
    setText(task.text)
  }, [task.text])

  const editTask = api.todo.edit.useMutation({
    async onMutate({ id, data }) {
      await utils.todo.all.cancel()
      const allTasks = utils.todo.all.getData()
      if (allTasks) {
        utils.todo.all.setData(
          undefined,
          allTasks.map(t => {
            if (t.id == id) {
              return {
                ...t,
                ...data,
              }
            }
            return t
          })
        )
      }
    }
  })

  const deleteTask = api.todo.delete.useMutation({
    async onMutate() {
      await utils.todo.all.cancel()
      const allTasks = utils.todo.all.getData()
      if (allTasks) {
        utils.todo.all.setData(
          undefined,
          allTasks.filter((t) => t.id != task.id),
        );
      }
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)
  useClickOutside({
    ref: wrapperRef,
    enabled: editing,
    callback() {
      editTask.mutate({
        id: task.id,
        data: { text },
      });
      setEditing(false);
    },
  });
  return <li ref={wrapperRef}
    className={` 
  ${editing && 'editing'}
  ${task.completed && 'completed'}
  `}>
    <div className="view">
      <input type="checkbox" className="toggle"
        checked={task.completed}
        onChange={e => {
          const checked = e.currentTarget.checked
          editTask.mutate({
            id: task.id,
            data: {
              completed: checked
            }
          })
        }}
        autoFocus={editing}
      />
      <label onDoubleClick={e => {
        setEditing(true)
        e.currentTarget.focus()
      }}>
        {text}
      </label>
      <button className='destroy' onClick={e => {
        deleteTask.mutate(task.id)
      }} />
    </div>
    <input className='edit'
      value={text}
      ref={inputRef}
      onChange={e => {
        const newText = e.currentTarget.value
        setText(newText)
      }}
      onKeyDown={e => {
        if (e.key == "Enter") {
          editTask.mutate({
            id: task.id,
            data: {
              text
            }
          })
          setEditing(false)
        }
      }}
    />
  </li>
}
export default TodosPage;

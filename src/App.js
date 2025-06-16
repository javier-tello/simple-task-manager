import { useState } from 'react';
import './App.css';

// Priority levels
const PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

function App() {
  const [idCounter, setIdCounter] = useState(0);

  const [task, setTask] = useState({
    id: "",
    title: "",
    description: "",
    priority: "",
    completedStatus: false,
  });

  const [tasks, setTasks] = useState([]);

  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const changeTaskStatus = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId
      ? {...task, completedStatus: !task.completedStatus}
      : task
    ));
  }

  const [selectedDropDownOption, setSelectedDropDownOption] = useState('');


  const handleDropDownChange = (e) => {
    setSelectedDropDownOption(e.target.value);
  };


  return (
    <div className="app">
      <h1>React Task Manager</h1>
      <div className='container'>
        <TaskForm
          task={task}
          setTask={setTask}
          idCounter={idCounter}
          setIdCounter={setIdCounter}
          tasks={tasks}
          setTasks={setTasks}
        />

        <div className="task-management">
          <TaskList
            tasks={tasks}
            removeTask={removeTask}
            changeTaskStatus={changeTaskStatus}
            selectedDropDownOption={selectedDropDownOption}
            handleDropDownChange={handleDropDownChange}
          />
        </div>
        <TaskStats
            tasks={tasks}
          />
      </div>
    </div>
  );
}

function TaskForm({ task, setTask, idCounter, setIdCounter, tasks, setTasks }) {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      ...task,
      id: idCounter,
      completedStatus: task.completedStatus || false
    }

    const formErrors = validateForm();
    setErrors(formErrors);

    if (Object.keys(formErrors).length ===0){
      setTimeout(() => {
        setIdCounter(idCounter + 1);
        setTasks([...tasks, newTask]);

        setTask({
          title: "",
          description: "",
          priority: "",
          completedStatus: false,
        });
      }, 1500);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    let formErrors = {};

    if (!task.title.trim()){
      formErrors.title = "Title for task is required";
    }

    if (!task.description.trim()){
      formErrors.description = "Description for task is required";
    }

    if (!task.priority) {
      formErrors.priority = "Task must have a priority"
    }

    return formErrors
  }

  return (
    <div className="task-form">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>Title</label>
          <input type='text' id='title' value={task.title} name='title' onChange={handleChange}/>
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>
        <div className='form-group'>
          <label htmlFor='description'>Description</label>
          <textarea id='description' value={task.description} name='description' onChange={handleChange}/>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>
        <div className='form-group'>
          <fieldset className='form-group'>
            <legend>Priority</legend>
            <input
              type='radio'
              id='priority-low'
              value={PRIORITY.LOW}
              name='priority'
              checked={task.priority === PRIORITY.LOW}
              onChange={handleChange}
            />
            <label htmlFor='priority-low'>Low</label>

            <input
              type='radio'
              id='priority-medium'
              value={PRIORITY.MEDIUM}
              name='priority'
              checked={task.priority === PRIORITY.MEDIUM}
              onChange={handleChange}
            />
            <label htmlFor='priority-medium'>Medium</label>

            <input
              type='radio'
              id='priority-high'
              value={PRIORITY.HIGH}
              name='priority'
              checked={task.priority === PRIORITY.HIGH}
              onChange={handleChange}
            />
            <label htmlFor='priority-high'>High</label>
          </fieldset>
          {errors.priority && <span className="error-message">{errors.priority}</span>}
        </div>
        <div className='form-actions'>
          <button type='submit'>Add Task</button>
        </div>
      </form>
    </div>
  );
}

function TaskList({ tasks, removeTask, changeTaskStatus, selectedDropDownOption, setSelectedDropDownOption, handleDropDownChange }) {
  const filteredTasks = selectedDropDownOption ? tasks.filter(task => task.priority == selectedDropDownOption) : tasks;

  return (
    <>
    <TaskFilter
        selectedDropDownOption={selectedDropDownOption}
        handleDropDownChange={handleDropDownChange}
      />
    <div className="task-list">
      <h2>Tasks</h2>
      { selectedDropDownOption && <h5> Filtering  by {selectedDropDownOption} Priority</h5>}
      {tasks.length === 0 ? (
        <p>There are no taks</p>
      ) : (
        <>
          {filteredTasks.map(task => (
              <div key={task.id} className='task-item'>
                <h3>Status: {task.completedStatus ? 'Completed' : 'To Do' }</h3>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <div className={`priority-badge priority-${
                  task.priority === PRIORITY.LOW ? 'Low' :
                  task.priority === PRIORITY.MEDIUM ? 'Medium' :
                  'High'
                }`}>
                  Priority: {task.priority}
                </div>
                <div className='task-actions'>
                  {task.completedStatus ?
                    <button className='complete' onClick={() => changeTaskStatus(task.id)}>Change To Do</button> :
                    <button className='uncomplete' onClick={() => changeTaskStatus(task.id)}>Complete Task</button>
                  }
                    <button
                      className='delete'
                      onClick={() => removeTask(task.id)}
                    >
                      Remove
                    </button>
                </div>
            </div>
          ))}
        </>
      )}
    </div>
    </>
  );
}

function TaskFilter({ selectedDropDownOption, handleDropDownChange }) {
  return (
    <div className="task-filter">
      <h3>Filter by Priority</h3>
      <select
        value={selectedDropDownOption}
        onChange={handleDropDownChange}
        className="dropdown"
      >
        <option value="">Priorities:</option>
        {Object.keys(PRIORITY).map(key => (
          <option key={key} value={PRIORITY[key]}>
            {PRIORITY[key]}
          </option>
        ))}
    </select>
    </div>
  );
}

function TaskStats({ tasks }) {
  const calculateCompeltedTasks = tasks.filter(task => task.completedStatus === true).length
  const calculatePendingTasks = tasks.filter(task => task.completedStatus === false).length
  return (
    <div className="task-stats">
      <h3>Task Statistics</h3>
      <ul>
        <li className='stat-item'>There are a total of {tasks.length} task(s).</li>
        <li className='stat-item'>There are {calculateCompeltedTasks} Completed task(s).</li>
        <li className='stat-item'>There are {calculatePendingTasks} Pending task(s).</li>
      </ul>
    </div>
  );
}

export default App;

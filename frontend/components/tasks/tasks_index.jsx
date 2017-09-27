import React from 'react';
import TasksDetailContainer from './tasks_detail_container';
import merge from 'lodash/merge';

export default class TasksIndex extends React.Component{
  constructor(props){
    super(props);

    this.state = { taskDetailIsOpen: false };
    this.newTask = this.newTask.bind(this);
    this.closeDetail = this.closeDetail.bind(this);
    this.handleTaskClick = this.handleTaskClick.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentWillReceiveProps(newProps){
    const tasks = newProps.state.entities.tasks;

    if (tasks){
      this.setState(tasks);
    }
  }

  newTask(event){
    event.preventDefault();

    const team = this.props.state.entities.team;
    const projectDisplayId = this.props.state.ui.projectDisplay;
    const projectId = projectDisplayId ? projectDisplayId : null;

    const task = {
      team_id: team.id,
      project_id: projectId
    };

    this.props.createTask(task).then(
      () => this.setState({ taskDetailIsOpen: true })
    );
  }

  closeDetail(event){
    if (event){
      event.preventDefault();
    }
    this.setState({ taskDetailIsOpen: false });
  }

  handleTaskClick(event){
    event.preventDefault();
    const taskId = parseInt(event.target.id);
    const task = this.props.state.entities.tasks[taskId];

    this.props.receiveTask({ tasks: { [task.id]: { task } }});
    this.setState({ taskDetailIsOpen: true });
  }

  handleInput(event, inputType){
    const taskId = event.target.id;
    const newState = merge({}, this.state, { [taskId]: { [inputType]: event.target.value }});

    this.setState(newState);
  }

  tasksIndexContent(){
    const tasks = this.props.tasks;
    const projectDisplay = this.props.state.ui.projectDisplay;

    if (tasks){
      const taskList = tasks.map((task, i) => {
        if (task.parent_task_id) {
          return;
        }
        else if (projectDisplay > 0 && task.project_id !== projectDisplay) {
          return;
        }
        else {
          const title = this.state[task.id].title;
          return (
            <li
              id={ task.id }
              key={i}>

              <div className={ task.completed ?
                  'checkmark-done' : 'checkmark-not-done'}>L</div>
              <input
                id={ task.id }
                onClick={ this.handleTaskClick }
                onChange= { event => this.handleInput(event, 'title') }
                value={ title ? title : '' }></input>
            </li>
          );
        }
      });

      return <ul>{ taskList }</ul>;
    }
  }

  render(){
    return (
      <div className='tasks-ui'>
        <div className='tasks-index'>
          <div id='header'>
            <button onClick={this.newTask}>Add Task</button>
          </div>

          { this.tasksIndexContent() }
        </div>

        { this.state.taskDetailIsOpen ?
          <TasksDetailContainer
            toggle={this.closeDetail}
            indexState={this.state}
            titleChange={this.handleInput} /> : null }
      </div>
    );
  }
}
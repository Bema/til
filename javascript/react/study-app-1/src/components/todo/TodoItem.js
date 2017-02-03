import React, {Component} from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import IconDelete from 'react-icons/lib/md/delete';
import {StatusButton} from './components';

export class TodoItem extends Component {

  constructor(props) {
    super(props);

    this.state = {
      todo: props.todo
    }

    this.debouncedHandleSaveTodo = debounce(props.handleSaveTodo, 300);
  }

  componentWillReceiveProps(nextProps) {
    this.setState((prevState, props) => ({
      todo: nextProps.todo
    }));
  }

  handleSave = (propName, value) => {
    this.setState((prevState, props) => {
      const updatedTodod = {...prevState.todo, [propName]: value};
      this.debouncedHandleSaveTodo(updatedTodod);
      return {todo: updatedTodod};
    });
  }

  handleRemove = (event) => {
    event.stopPropagation();

    if(this.state.removeActive) {
      clearTimeout(this.state.removeActive);
      return this.props.handleRemoveTodo(this.state.todo);
    }

    const removeActiveTimeoutId = setTimeout(() => {
      this.setState({removeActive: false});
    }, 3000);

    this.setState({removeActive: removeActiveTimeoutId});
  }

  toggleEditMode = () => {
    this.setState((prevState, props) => {

      /**
        * if edit mode is being turned off we must delay
        * removing the edit action buttons to allow todo element to animate close
        **/

      if(prevState.isEditing) {
        setTimeout(() => {
          this.setState((prevState) => ({
            holdEditingTools: prevState.isEditing
          }));
        }, 1000);
      }

      return {
        isEditing: !prevState.isEditing,
        holdEditingTools: prevState.isEditing
      };
    });
  }

  render() {
    const { todo, removeActive, holdEditingTools, isEditing } = this.state;
    console.log(isEditing);

    return (
      <li className={classNames('todo-item', {'todo-item__complete': todo.isComplete, 'todo-item__editing': isEditing})}
          onClick={this.toggleEditMode}>

        <StatusButton
          status={todo.isComplete}
          handleToggle={status => this.handleSave('isComplete', status)}
        />

      {!isEditing && <div className="todo-item-label">{todo.title}</div>}
        { isEditing &&
          <input type="text"
              autoFocus={!todo.title}
              className="todo-item-label-input"
              onClick={event => event.stopPropagation()}
              onChange={event => this.handleSave('title', event.target.value)}
              value={todo.title}/>}

      {(isEditing || holdEditingTools) &&
        <div className="todo-item-actions">
          <div onClick={this.handleRemove}
              className={classNames("todo-item-action-button", {"todo-item-action-button__active": removeActive})} >
            <IconDelete />
          </div>
        </div>
      }
      </li>
    )
  }
}


TodoItem.propTypes = {
  todo: React.PropTypes.object.isRequired,
  handleSaveTodo: React.PropTypes.func.isRequired,
  handleRemoveTodo: React.PropTypes.func.isRequired,
};

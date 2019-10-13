import React, { Component } from 'react';
import testTodoListData from './TestTodoListData.json'
import HomeScreen from './components/home_screen/HomeScreen'
import ItemScreen from './components/item_screen/ItemScreen'
import ListScreen from './components/list_screen/ListScreen'

const AppScreen = {
  HOME_SCREEN: "HOME_SCREEN",
  LIST_SCREEN: "LIST_SCREEN",
  ITEM_SCREEN: "ITEM_SCREEN"
}

class App extends Component {
  state = {
    currentScreen: AppScreen.HOME_SCREEN,
    todoLists: testTodoListData.todoLists,
    currentList: null,
    indexToRemove: null
  }

  goHome = () => {
    this.setState({currentScreen: AppScreen.HOME_SCREEN});
    this.setState({currentList: null});
  }

  loadList = (todoListToLoad) => {
    this.setState({currentScreen: AppScreen.LIST_SCREEN});
    this.setState({currentList: todoListToLoad});
    console.log("currentList: " + this.state.currentList);
    console.log("currentScreen: " + this.state.currentScreen);
  }

  // Delete current TodoList
  delTodo = () => {
    this.setState({ todoLists: [...this.state.todoLists.filter(todoList => todoList.key !== this.state.currentList.key)]})
    this.goHome()
  }

  createTodoList = () => {
    let todoList = {
      "key": this.getNextAvailableTodoListKey(),
      "name": "Unknown",
      "Owner": "",
      "items": []
    }
    this.setState({ todoLists: [...this.state.todoLists, todoList]})
    this.loadList(todoList)
  }

  getNextAvailableTodoListKey = () => {
    let keyLists = []
    for (let i = 0; i < this.state.todoLists.length; i++) {
      keyLists.push(this.state.todoLists[i].key)
    }

    for (let i = 0; i < keyLists.length; i++) {
      if (!(keyLists.includes(i))) {
        return i
      }
    }

    return keyLists.length;  
  }

  getNextAvailableTodoListItemKey = () => {
    let keyLists = []
    for (let i = 0; i < this.state.currentList.items.length; i++) {
      keyLists.push(this.state.currentList.items[i].key)
    }

    for (let i = 0; i < keyLists.length; i++) {
      if (!(keyLists.includes(i))) {
        return i
      }
    }

    return keyLists.length;
  }

  // Add a new todoListItem to the current todoList
  createNewTodoListItem(newItem) {
    newItem.key = this.getNextAvailableTodoListItemKey()
    this.state.currentList.items.push(newItem)
    this.loadList(this.state.currentList)

    console.log(this.state.currentList)
  }

  editTodoListItem(newItem, itemIndex) {
    newItem.key = this.state.currentList.items[itemIndex].key
    this.state.currentList.items[itemIndex] = newItem
    this.loadList(this.state.currentList)
  }

  render() {
    switch(this.state.currentScreen) {
      case AppScreen.HOME_SCREEN:
        return <HomeScreen 
        loadList={this.loadList.bind(this)} 
        todoLists={this.state.todoLists}
        newTodoList={() => this.createTodoList()}/>;
      case AppScreen.LIST_SCREEN:            
        return <ListScreen
          goHome={this.goHome.bind(this)}
          todoList={this.state.currentList}
          deleteList={this.delTodo.bind(this)}
          displayNewListItem={
            () => {
              this.state.createNewList = true
              this.setState({currentScreen: AppScreen.ITEM_SCREEN})
            }
          }
          displayEditListItem={
            (index) => {
              this.state.createNewList = false
              this.setState({currentScreen: AppScreen.ITEM_SCREEN})
              this.setState({indexToRemove: index})
            }
          }
          />;
      case AppScreen.ITEM_SCREEN:
        return <ItemScreen
        hideNewListScreen={() => this.loadList(this.state.currentList)}
        createOrEditTodoListItem={
            (itemInfo) => (this.state.createNewList ? this.createNewTodoListItem(itemInfo) : this.editTodoListItem(itemInfo, this.state.indexToRemove))
        }/>;
      default:
        return <div>ERROR</div>;
    }
  }
}

export default App;
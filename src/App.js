import React, {Component} from 'react';

import AddListForm from './components/addListForm';
import List from './components/list';

import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            open: false,
            lists: [],
            openList: false
        }
    }

    openForm = () => {
        this.setState({
            open: true
        })
    };

    closeForm = () => {
        this.setState({
            open: false
        })
    };

    saveList = (listName) => {
        let {lists} = this.state;
        lists.push(listName);

        this.setState({
            lists: lists
        })
    };

    openList = () => {
        this.setState({
            openList: true
        })
    };

    closeList = () => {
        this.setState({
            openList: false
        })
    };

    render() {
        const {lists} = this.state;

        return (
            <div className='app'>
                <header className='app-header'>New Year 2019!!</header>
                <div className='app-content'>
                    <div className='app-content_list-box'>
                        <button className='list' onClick={this.openList}>new list</button>
                        {lists.map((listName) => {
                            return(
                                <button className='list' onClick={this.openList}>{listName}</button>
                            )
                        })}
                        <button className='add-list' onClick={this.openForm}>Add List</button>
                    </div>
                </div>

                <AddListForm open={this.state.open} closeForm={this.closeForm} saveList={this.saveList}/>
                <List openList={this.state.openList} closeList={this.closeList}/>

            </div>
        );
    }
}

export default App;

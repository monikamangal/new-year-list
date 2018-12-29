import React, {Component} from 'react';

import AddListForm from './components/addListForm';
import List from './components/list';
import { auth, database } from './components/Firebase/firebase';

import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            open: false,
            lists: [],
            openList: false,
            list: {}
        }
    }

    componentDidMount() {
        auth.signInAnonymously();
        auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                database.ref('/').on('value', (snapshot) => {
                    this.setState({lists: snapshot.val().filter(va => va !== null)})
                    // ...
                });
            } else {
                // User is signed out.
                // ...
            }
            // ...
        });

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

    saveList = (list) => {
        let {lists} = this.state;
        lists.push(list);

        this.setState({
            lists: lists
        })
    };

    openList = (list) => {

        console.log(list);
        this.setState({
            openList: true,
            list: list
        })
    };

    closeList = () => {
        this.setState({
            openList: false
        })
    };

    render() {
        const {lists, open, openList, list} = this.state;

        return (
            <div className='app'>
                <header className='app-header'>New Year 2019!!</header>
                <div className='app-content'>
                    <div className='app-content_list-box'>
                        {lists.map((list) => {
                            return(
                                <button className='list' onClick={() => this.openList(list)}>{list.name}</button>
                            )
                        })}
                        <button className='add-list' onClick={this.openForm}>Add List</button>
                    </div>
                </div>

                <AddListForm open={open} closeForm={this.closeForm} saveList={this.saveList}/>
                {openList && <List closeList={this.closeList} list={list}/>}

            </div>
        );
    }
}

export default App;

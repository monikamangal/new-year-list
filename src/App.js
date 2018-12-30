import React, {Component} from 'react';

import AddListForm from './components/addListForm';
import List from './components/list';
import {auth, database, googleAuthProvider} from './components/Firebase/firebase';

import './App.css';

class App extends Component {
    constructor() {
        super();

        this.state = {
            open: false,
            lists: new Map(),
            openList: false,
            list: {},
            currentUser: {}
        }
    }

    componentDidMount() {
        let {lists} = this.state;

        auth.onAuthStateChanged((currentUser) => {
            this.setState({currentUser: currentUser || {}});
            if (currentUser) {
                database.ref('/list/' + currentUser.uid).on('child_added', (snapshot) => {
                    lists.set(snapshot.key, snapshot.val());

                    this.setState({
                        lists: lists
                    })
                });

                database.ref('/list/' + currentUser.uid).on('child_removed', (snapshot) => {
                    lists.delete(snapshot.key);

                    this.setState({
                        lists: lists
                    })
                });

                database.ref('/list/' + currentUser.uid).on('child_changed', (snapshot) => {
                    lists.set(snapshot.key, snapshot.val());

                    this.setState({
                        lists: lists
                    })
                });

            } else {
                this.setState({
                    open: false,
                    lists: [],
                    openList: false,
                    list: {}
                });
            }
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
       let {currentUser} = this.state;
       database.ref('/list').child(currentUser.uid).push(list);
    };

    updateList = (list) => {
        const {id, currentUser} = this.state;
        database.ref('/list').child(currentUser.uid).child(id).set(list);

        this.closeList();
    };

    deleteList = () => {
        this.updateList(null);
    };

    openList = (list, id) => {
        this.setState({
            openList: true,
            list: list,
            id: id
        })
    };

    closeList = () => {
        this.setState({
            openList: false
        })
    };

    // Auth Events
    signIn() {
        auth.signInWithPopup(googleAuthProvider);
    }

    signOut() {
        auth.signOut();
    }

    displayCurrentUser() {
        return <img onClick={this.signOut}
                    src={this.state.currentUser.photoURL}
                    alt={this.state.currentUser.displayName}
                    className='current-user-image'
        />
    }

    render() {
        const {lists, open, openList, list} = this.state;
        let items = [];
        lists.forEach((list, id) => {
            items.push(
                <button key={id} className='list' onClick={() => this.openList(list, id)}>{list.name}</button>
            )
        });

        return (
            <div className='app'>
                <header className='app-header'>New Year 2019!!</header>
                <div className='app-content'>
                    {!this.state.currentUser.email && <span><a href="#" onClick={this.signIn}>Sign In</a> to new year list</span>}
                    {this.state.currentUser.email && <div className='app-content_list-box'>
                        {this.displayCurrentUser()}
                        {items}
                        <button key={'add-item'} className='add-list' onClick={this.openForm}>Add List</button>
                    </div>}
                </div>

                <AddListForm open={open} closeForm={this.closeForm} saveList={this.saveList}/>
                {openList && <List closeList={this.closeList}
                                   list={list}
                                   updateList={this.updateList}
                                   deleteList={this.deleteList}
                />}

            </div>
        );
    }
}

export default App;

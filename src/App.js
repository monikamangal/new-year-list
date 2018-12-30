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
            lists: [],
            openList: false,
            list: {},
            currentUser: {}
        }
    }

    componentDidMount() {

        auth.onAuthStateChanged((currentUser) => {
            this.setState({currentUser: currentUser || {}});
            if (currentUser) {
                database.ref('/list/' + currentUser.uid).on('value', (snapshot) => {
                    this.setState({lists: snapshot.val() !== null ? snapshot.val().filter(va => va !== null) : []})
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
        let {lists, currentUser} = this.state;
        lists.push(list);

       database.ref('/list').child(currentUser.uid).push(list);

        this.setState({
            lists: lists
        })
    };

    openList = (list) => {
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
        />
    }

    render() {
        const {lists, open, openList, list} = this.state;

        return (
            <div className='app'>
                <header className='app-header'>New Year 2019!!</header>
                <div className='app-content'>
                    <span>{this.state.currentUser.email ? this.displayCurrentUser() :
                        <a href="#" onClick={this.signIn}>Sign In</a>}</span>
                    <div className='app-content_list-box'>
                        {lists.map((list) => {
                            return (
                                <button key={list.name} className='list' onClick={() => this.openList(list)}>{list.name}</button>
                            )
                        })}
                        <button key={'add-item'} className='add-list' onClick={this.openForm}>Add List</button>
                    </div>
                </div>

                <AddListForm open={open} closeForm={this.closeForm} saveList={this.saveList}/>
                {openList && <List closeList={this.closeList} list={list}/>}

            </div>
        );
    }
}

export default App;

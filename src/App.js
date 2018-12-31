import React, {Component} from 'react';
import Select from '@material-ui/core/Select';

import AddListForm from './components/addListForm';
import List from './components/list';
import {auth, database, googleAuthProvider} from './components/Firebase/firebase';

class App extends Component {
    constructor() {
        super();

        this.state = {
            open: false,
            lists: new Map(),
            sharedList: new Map(),
            sharedDetails: new Map(),
            openList: false,
            list: {},
            currentUser: {},
            sharedWith: [],
            theme: 'theme-pink'
        }
    }

    componentDidMount() {
        let {lists, sharedList, sharedDetails} = this.state;

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

                this.fetchAndUpdateSharedList(currentUser, sharedList, sharedDetails);

                database.ref('/share').on('child_changed', () => {
                    this.fetchAndUpdateSharedList(currentUser, sharedList, sharedDetails);
                });

                database.ref('/share').on('child_removed', () => {
                    this.fetchAndUpdateSharedList(currentUser, sharedList, sharedDetails);
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

    fetchAndUpdateSharedList = (currentUser, sharedList, sharedDetails) => {
        database.ref('/share').on('child_added', (snapshot) => {
            this.updateSharedList(snapshot, currentUser, sharedList, sharedDetails);
        });
    };

    updateSharedList = (snapshot, currentUser, sharedList, sharedDetails) => {
        let sharedDetail = snapshot.val();
        let isEligible = sharedDetail.sharedWith.some(value => value === currentUser.email);

        if (isEligible) {
            database.ref('/list/' + sharedDetail.sharedBy).child(snapshot.key).on('value', (snapshot) => {
                sharedList.set(snapshot.key, snapshot.val());
                sharedDetails.set(snapshot.key, sharedDetail.sharedByEmail);

                this.setState({
                    sharedList: sharedList,
                    sharedDetails: sharedDetails
                })
            });

        } else {
            this.setState({
                sharedList: new Map(),
                sharedDetails: new Map()
            })
        }
    };

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

    shareList = (email, action) => {
        let {currentUser, id, sharedWith} = this.state;
        if (action === 'remove') {
            sharedWith = sharedWith.filter((val) => val !== email);
        } else {
            sharedWith.push(email);
        }

        if (sharedWith.length <= 0) {
            database.ref('/share').child(id).set(null);
        } else {
            const shareList = {
                sharedBy: currentUser.uid,
                sharedByEmail: currentUser.email,
                sharedWith: sharedWith
            };
            database.ref('/share').child(id).set(shareList);
        }
    };

    openList = (list, id, shared) => {
        database.ref('/share/' + id).on('value', (snapshot) => {
            this.setState({
                sharedWith: snapshot.val() !== null ? snapshot.val().sharedWith : []
            })
        });

        this.setState({
            openList: true,
            shared: shared,
            list: list,
            id: id
        })
    };

    closeList = () => {
        this.setState({
            openList: false
        })
    };

    selectTheme = (e) => {
        this.setState({
            theme: e.target.value
        })
    };

    // Auth Events
    static signIn() {
        auth.signInWithPopup(googleAuthProvider);
    }

    static signOut() {
        auth.signOut();
    }

    displayCurrentUser() {
        return (
            <div className='current-user-block'>
                <img onClick={App.signOut}
                     src={this.state.currentUser.photoURL}
                     alt={this.state.currentUser.displayName}
                     className='current-user-image'
                />
                <p className='select-theme-label'>Hello {this.state.currentUser.displayName}</p>
                <label className='select-theme-label'>Select Theme</label>
                <select onChange={this.selectTheme} defaultValue={this.state.theme} className='current-user-theme'>
                    <option value="theme-pink">Pink</option>
                    <option value="theme-blue">Blue</option>
                    <option value="theme-green">Green</option>
                    <option value="theme-purple">Purple</option>
                    <option value="theme-yellow">Yellow</option>
                </select>
                <button className='select-theme-label sign-out' onClick={App.signOut}>Sign Out</button>
            </div>
        )
    }

    render() {
        const {lists, open, openList, list, shared, sharedList, sharedWith, theme} = this.state;
        let items = [];
        lists.forEach((list, id) => {
            items.push(
                <button key={id} className='list' onClick={() => this.openList(list, id, false)}>{list.name}</button>
            )
        });

        let sharedItems = [];
        sharedList.forEach((list, id) => {
            sharedItems.push(
                <button key={id} className='list'
                        onClick={() => this.openList(list, id, true)}>{list.name + "*"}</button>
            )
        });

        return (
            <div className={`${theme}`}>
                <div className='app'>
                    <header className='app-header'>New Year 2019!!</header>
                    <div className='app-content'>
                        {!this.state.currentUser.email &&
                        <span><a href="#" onClick={App.signIn}>Sign In</a> to new year list</span>}
                        {this.state.currentUser.email &&
                        <div className='app-content_blocks'>
                            {this.displayCurrentUser()}
                            <div className='app-content_list-box'>
                                {items}

                                {sharedItems.length !== 0 && <div>
                                    {sharedItems}
                                </div>
                                }

                                <button key={'add-item'} className='add-list' onClick={this.openForm}>Add List</button>
                            </div>
                        </div>}
                    </div>

                    <AddListForm open={open} closeForm={this.closeForm} saveList={this.saveList}/>
                    {openList && <List closeList={this.closeList}
                                       list={list}
                                       shared={shared}
                                       updateList={this.updateList}
                                       deleteList={this.deleteList}
                                       shareList={this.shareList}
                                       sharedWith={sharedWith}
                    />}

                </div>
            </div>
        );
    }
}

export default App;

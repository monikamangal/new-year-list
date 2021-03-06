import React from 'react';
import Modal from '@material-ui/core/Modal';
import moment from 'moment';

class List extends React.Component {
    constructor() {
        super();
        this.newItem = React.createRef();
        this.email = React.createRef();

        this.state = {
            itemsDone: [],
            itemsPending: []
        }
    }

    componentDidMount() {
        const items = this.props.list.items;
        if (items !== undefined) {
            const itemsDone = items.filter((item) => {
                return item.status === true;
            });
            const itemsPending = items.filter((item) => {
                return item.status === false;
            });

            this.setState({
                itemsDone: itemsDone,
                itemsPending: itemsPending
            });
        }
    }

    removeFromDone = (selected) => {
        if (!this.props.shared) {
            let {itemsDone, itemsPending} = this.state;
            itemsDone = itemsDone.filter((item) => {
                return item.description !== selected.description
            });

            selected.status = false;
            selected.updatedDate = moment(new Date()).format('MMMM Do YYYY');

            itemsPending.push(selected);

            this.setState({
                itemsDone: itemsDone,
                itemsPending: itemsPending
            })
        }
    };

    removeFromPending = (selected) => {
        if (!this.props.shared) {
            let {itemsDone, itemsPending} = this.state;
            itemsPending = itemsPending.filter((item) => {
                return item.description !== selected.description
            });

            selected.status = true;
            selected.updatedDate = moment(new Date()).format('MMMM Do YYYY');

            itemsDone.push(selected);

            this.setState({
                itemsDone: itemsDone,
                itemsPending: itemsPending
            })
        }
    };

    UpdateList = () => {
        let {itemsDone, itemsPending} = this.state;

        const list = {
            ...this.props.list,
            items: itemsDone.concat(itemsPending)
        };

        this.props.updateList(list);
    };

    addNewItem = () => {
        let {itemsPending} = this.state;

        const newItem = {
            description: this.newItem.current.value,
            status: false,
            updatedDate: moment(new Date()).format('MMMM Do YYYY')
        };

        itemsPending.push(newItem);
        this.newItem.current.value = '';

        this.setState({
            itemsPending: itemsPending
        })
    };

    shareList = () => {
        const email = this.email.current.value;
        this.email.current.value = '';

        this.props.shareList(email);
    };

    removeFromShare = (email) => {
        this.props.shareList(email, 'remove');
    };

    render() {
        const {itemsDone, itemsPending} = this.state;
        const {list, sharedWith} = this.props;

        return (
            <Modal open={true} onClose={this.props.closeList}>
                <div className='modal-content'>
                    <div className='modal-content_form'>
                        <p className='list-name'>Welcome to {list.name} created on {list.added}!!</p>
                        <div className='modal-content_list'>
                            <div className='modal-content_list-item'>
                                <p>Items done</p>
                                <ul className='list-block'>
                                    {itemsDone.map((item, i) => {
                                        return <li key={i} className='item-done item'
                                                   onClick={() => this.removeFromDone(item)}>{item.description}</li>
                                    })}
                                </ul>
                            </div>
                            <div className='modal-content_list-item'>
                                <p>Items pending</p>
                                <ul className='list-block'>
                                    {itemsPending.map((item, i) => {
                                        return <li key={i} className='item'
                                                   onClick={() => this.removeFromPending(item)}>{item.description}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        {sharedWith.length > 0 && !this.props.shared && <div className='modal-content_shared'>
                            <p>Shared with</p>
                            <ul className='list-block'>
                                {sharedWith.map((item, i) => {
                                    return <li key={i} className='item'
                                               onClick={() => this.removeFromShare(item)}>{item}</li>
                                })}
                            </ul>
                        </div>}
                        {!this.props.shared && [<div key={'new-item'} className='form-field'>
                            <input style={{'width': '80%'}} type='text' placeholder='Add new item...'
                                   ref={this.newItem}/>
                            <button className='add-item_action' onClick={this.addNewItem}>Add Item</button>
                        </div>,
                            <div key={'share-list'} className='form-field'>
                                <input style={{'width': '80%'}} type='text' placeholder='Enter email...'
                                       ref={this.email}/>
                                <button className='add-item_action' onClick={this.shareList}>Share List</button>
                            </div>,
                            <div key={'actions'} className='list-action'>
                                <button className='list-action_cancel' onClick={this.props.deleteList}>Delete</button>
                                <button className='list-action_save' onClick={this.UpdateList}>Update</button>
                            </div>]}
                    </div>
                </div>
            </Modal>
        )
    }
}

export default List;
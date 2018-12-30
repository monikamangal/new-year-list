import React, {Component} from 'react';
import Modal from '@material-ui/core/Modal';

import '../css/list.css';

class List extends React.Component {
    constructor() {
        super();

        this.state = {
            itemsDone: [],
            itemsPending: []
        }
    }

    componentDidMount() {
        const items = this.props.list.items;
        if(items !== undefined) {
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
        let {itemsDone, itemsPending} = this.state;
        itemsDone = itemsDone.filter((item) => {
            return item.description !== selected.description
        });

        selected.status = false;

        itemsPending.push(selected);

        this.setState({
            itemsDone: itemsDone,
            itemsPending: itemsPending
        })
    };

    removeFromPending = (selected) => {
        let {itemsDone, itemsPending} = this.state;
        itemsPending = itemsPending.filter((item) => {
            return item.description !== selected.description
        });

        selected.status = true;

        itemsDone.push(selected);

        this.setState({
            itemsDone: itemsDone,
            itemsPending: itemsPending
        })
    };

    UpdateList = () => {
        let {itemsDone, itemsPending} = this.state;

        const list = {
            ...this.props.list,
            items: itemsDone.concat(itemsPending)
        };

        this.props.updateList(list);
    };

    render() {
        const {itemsDone, itemsPending} = this.state;
        const {list} = this.props;

        return (
            <Modal open={true} onClose={this.props.closeList}>
                <div className='modal-content'>
                    <div className='modal-content_form'>
                        <p className='list-name'>Hello {list.addedBy} !!</p>
                        <p className='list-name'>Welcome to {list.name}</p>
                        <div className='modal-content_list'>
                            <div className='modal-content_list-item'>
                                <p>Items Done</p>
                                <ul className='list-block'>
                                    {itemsDone.map((item, i) => {
                                        return <li key={i} className='item-done item' onClick={() => this.removeFromDone(item)}>{item.description}</li>
                                    })}
                                </ul>
                            </div>
                            <div className='modal-content_list-item'>
                                <p>Items Pending</p>
                                <ul className='list-block'>
                                    {itemsPending.map((item, i) => {
                                        return <li key={i} className='item' onClick={() => this.removeFromPending(item)}>{item.description}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='list-action'>
                            <button className='list-action_cancel' onClick={this.props.closeList}>Cancel</button>
                            <button className='list-action_save' onClick={this.UpdateList}>Update</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default List;
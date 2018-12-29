import React, {Component} from 'react';
import Modal from '@material-ui/core/Modal';

import '../css/list.css';

const dummyList = {
    listName: 'Foo',
    itemsDone: ['first', 'second', 'third', 'fourth', 'fifth', 'first', 'second', 'third', 'fourth', 'fifth', 'first', 'second', 'third', 'fourth', 'fifth', 'first', 'second', 'third', 'fourth', 'fifth', 'first', 'second', 'third', 'fourth', 'fifth'],
    itemsPending: ['sixth very very very very long long text for the list item', 'seventh', 'eight', 'ninth', 'tenth'],
};

class List extends React.Component {
    constructor() {
        super();

        this.state = {
            itemsDone: dummyList.itemsDone,
            itemsPending: dummyList.itemsPending
        }
    }

    removeFromDone = (item) => {
        let {itemsDone, itemsPending} = this.state;
        const index = itemsDone.indexOf(item);
        if (index > -1) {
            itemsDone.splice(index, 1);
        }
        itemsPending.push(item);

        this.setState({
            itemsDone: itemsDone,
            itemsPending: itemsPending
        })
    };

    removeFromPending = (item) => {
        let {itemsDone, itemsPending} = this.state;
        const index = itemsPending.indexOf(item);
        if (index > -1) {
            itemsPending.splice(index, 1);
        }
        itemsDone.push(item);

        this.setState({
            itemsDone: itemsDone,
            itemsPending: itemsPending
        })
    };

    render() {
        const {itemsDone, itemsPending} = this.state;

        return (
            <Modal open={this.props.openList} onClose={this.props.closeList}>
                <div className='modal-content'>
                    <div className='modal-content_form'>
                        <p className='list-name'>{dummyList.listName}</p>
                        <div className='modal-content_list'>
                            <div className='modal-content_list-item'>
                                <h3>Items Done</h3>
                                <ul className='list-block'>
                                    {itemsDone.map((item, i) => {
                                        return <li key={i} className='item-done item' onClick={() => this.removeFromDone(item)}>{item}</li>
                                    })}
                                </ul>
                            </div>
                            <div className='modal-content_list-item'>
                                <h3>Items Pending</h3>
                                <ul className='list-block'>
                                    {itemsPending.map((item, i) => {
                                        return <li key={i} className='item' onClick={() => this.removeFromPending(item)}>{item}</li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        <div className='list-action'>
                            <button className='list-action_cancel' onClick={this.props.closeList}>Cancel</button>
                            <button className='list-action_save'>Save List</button>
                        </div>
                    </div>
                </div>
            </Modal>
        )
    }
}

export default List;
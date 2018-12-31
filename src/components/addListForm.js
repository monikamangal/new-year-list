import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import moment from 'moment';

class AddListForm extends Component {
    constructor() {
        super();

        this.state = {
            listItems: [],
            itemValue: '',
            listName: '',
        }
    }

    addItems = () => {
        let {listItems, itemValue} = this.state;
        const item = {
            'description': itemValue,
            'status': false,
            'updatedDate': moment(new Date()).format('MMMM Do YYYY'),
        };

        listItems.push(item);

        this.setState({
            listItems: listItems,
            itemValue: ''
        })
    };

    handleChange = (e) => {
        this.setState({
            itemValue: e.target.value
        })
    };

    listNameChange = (e) => {
        this.setState({
            listName: e.target.value
        })
    };

    saveList = () => {
        const {listItems, listName} = this.state;

        const list = {
            'added': moment(new Date()).format('MMMM Do YYYY'),
            'name': listName,
            'items': listItems
        };

        this.props.closeForm();
        this.props.saveList(list);
    };

    render() {
        const {listItems, itemValue, listName} = this.state;

        return (
            <Modal open={this.props.open} onClose={this.props.closeForm}>
                <div className='modal-content'>
                    <div className='modal-content_form'>
                        <input placeholder='List Name...' className='modal-content_form-name' onChange={this.listNameChange} value={listName}/>
                        <AddItems addItems={this.addItems} itemValue={itemValue} handleChange={this.handleChange}/>
                        <ul className='list-block'>
                        {listItems.map((item, i) => {
                            return <li key={i}>{item.description}</li>
                        })}
                        </ul>
                        <button className='add-item_action' onClick={this.saveList}>Save List</button>
                    </div>
                </div>
            </Modal>
        );
    }
}


function AddItems(props) {
    return (
        <div className='form-field'>
            <input style={{'width': '80%'}} type='text' value={props.itemValue} placeholder='Enter item...' onChange={props.handleChange}/>
            <button className='add-item_action' onClick={props.addItems}>Add Item</button>
        </div>
    )
}


export default AddListForm;
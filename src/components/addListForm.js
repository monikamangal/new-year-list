import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';

import '../css/add-list-form.css';

class AddListForm extends Component {
    constructor() {
        super();

        this.state = {
            listItems: [],
            itemValue: '',
            listName: '',
            userName: ''
        }
    }

    addItems = () => {
        let {listItems, itemValue} = this.state;
        const item = {
            'description': itemValue,
            'status': false
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

    userNameChange = (e) => {
        this.setState({
            userName: e.target.value
        })
    };

    saveList = () => {
        const {listItems, listName, userName} = this.state;

        const list = {
            'added': new Date(),
            'addedBy': userName,
            'name': listName,
            'items': listItems
        };
        console.log(list);

        this.props.closeForm();
        this.props.saveList(list);
    };

    render() {
        const {listItems, itemValue, listName, userName} = this.state;

        return (
            <Modal open={this.props.open} onClose={this.props.closeForm}>
                <div className='modal-content'>
                    <div className='modal-content_form'>
                        <input placeholder='List Name...' className='modal-content_form-name' onChange={this.listNameChange} value={listName}/>
                        <input placeholder='Your Name...' className='modal-content_form-name' onChange={this.userNameChange} value={userName}/>
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
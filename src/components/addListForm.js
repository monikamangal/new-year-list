import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';

import '../css/add-list-form.css';

class AddListForm extends Component {
    constructor() {
        super();

        this.state = {
            listItems: [],
            itemValue: '',
            listName: ''
        }
    }

    addItems = (item) => {
        let {listItems} = this.state;
        listItems.push(item);

        this.setState({
            listItems: listItems
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

    saveList = (listName) => {
        this.props.closeForm();
        this.props.saveList(listName);
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
                            return <li key={i}>{item}</li>
                        })}
                        </ul>
                        <button className='add-item_action' onClick={() => this.saveList(listName)}>Save List</button>
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
            <button className='add-item_action' onClick={() => props.addItems(props.itemValue)}>Add Item</button>
        </div>
    )
}


export default AddListForm;
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';

const ModalContainer = (props:any) => {


  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header><Modal.Title>Add fieldtype</Modal.Title></Modal.Header>
        <Modal.Body>
          {props.children}
        </Modal.Body>
        <Modal.Footer>
            <Button variant='primary' onClick={() => {props.setShow(false)}}>Cancel</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ModalContainer
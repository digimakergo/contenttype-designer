import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';

const ListOfErrors = (props:any) => {
  return (
    <Modal show={props.show} onHide={() => {
        props.setShow(false)
    }} restoreFocus={false}>
    <Modal.Header><Modal.Title>List of errors</Modal.Title></Modal.Header>

    <Modal.Body>
        {props.errors.map((error:any, index:number) => (
            <Row key={"error-"+index}>
                <Button style={{color:"red", textDecoration:"underline"}} onClick={() => {
                    const element = document.getElementById(error.from);
                    element?.scrollIntoView();
                }} variant="default">{error.message}</Button>
            </Row>
        ))}
    </Modal.Body>
    <Modal.Footer>
        <Button variant='primary' onClick={() => {
            props.setShow(false)
        }}>Cancel</Button>
    </Modal.Footer>
</Modal>
  )
}

export default ListOfErrors
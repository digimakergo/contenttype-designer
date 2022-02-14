import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


import { useState } from 'react';

const ModalContainer = (props:any) => {

    const [name, setName] = useState("");
    const [type, setType] = useState("");



  return (
    <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header><Modal.Title>Add fieldtype</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row style={{margin:"0.5rem"}}>
            <Form.Control type='text' placeholder='Write a field name'  onChange={(e) => {
                setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
            }}/>
          </Row>
          <Row style={{margin:"0.5rem"}}>
            <Form.Select  style={{border:"solid black 3px"}} onChange={(event) => {
              setType(event.target.value)
            }}>
              <option>Choose a type</option>
              {Object.keys(props.fieldtypes).map((element:any, index:number)=>(
                <option key={index}>{element}</option>
              ))}
            </Form.Select>
          </Row>
    
    
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => {
              props.onClick(name, type);
              props.setShow(false);
          }
          }>ADD</Button>
            <Button variant='primary' onClick={() => {props.setShow(false)}}>Cancel</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ModalContainer
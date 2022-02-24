import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


import { useState } from 'react';

const AddField = (props:any) => {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [validated, setValidate] = useState(true);



  return (

    <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header><Modal.Title>Add fieldtype</Modal.Title></Modal.Header>
    
        <Modal.Body>
        <Form noValidate  validated={validated}>
          <Row style={{margin:"0.5rem"}}>

            <Form.Control required type='text' placeholder='Write a field name' onChange={(e) => {
                setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
            }}/>
          <Form.Control.Feedback type="invalid">
            Please write a name
          </Form.Control.Feedback>

          </Row>
          <Row style={{margin:"0.5rem"}}>
            <Form.Control required as="select" type="select" style={{border:"solid black 3px"}} onChange={(event) => {
              setType(event.target.value)
            }}>
              <option key={'empty'} value={''}>Choose a type</option>
              {Object.keys(props.fieldtypes).map((element:any, index:number)=>(
                <option key={index}>{element}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
            Please choose a file
          </Form.Control.Feedback>
          </Row>
          </Form>
    
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

export default AddField
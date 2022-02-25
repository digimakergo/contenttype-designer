import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


import { useState } from 'react';

const AddField = (props:any) => {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    



  return (

    <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header><Modal.Title>Add fieldtype</Modal.Title></Modal.Header>
    
        <Modal.Body>
       <Form noValidate>
          <Row style={{margin:"0.5rem"}}>

            <Form.Control required type='text' placeholder='Write a field name'  onChange={(e:any) => {
                setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));

                if(e.target.value== ""){
                  e.target.style= "border: solid red 2px;"
              }
              props.field.identifier = e.target.value;  
                
            }}/>
          
         
          </Row>
          <Row style={{margin:"0.5rem"}}>
            <Form.Control required as="select" type="select" style={{border:"solid black 3px"}} onChange={(event:any) => {
              setType(event.target.value)

              if(event.target.value== ""){
                event.target.style= "border: solid red 2px;"
            }
            props.field.identifier = event.target.value;  
            }}>
              <option key={'empty'} value={''}>Choose a type</option>
              {Object.keys(props.fieldtypes).map((element:any, index:number)=>(
                <option key={index}>{element}</option>
              ))}
            </Form.Control>
           
          </Row>
          </Form>
    
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => {

              

              if(name!="" && type!=""){
                props.onClick(name, type);
                props.setShow(false);
              }
             
          }
        

          }>ADD</Button>
            <Button variant='primary' onClick={() => {props.setShow(false)}}>Cancel</Button>
            
        </Modal.Footer>
    </Modal>
  )
}

export default AddField
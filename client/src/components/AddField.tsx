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
              if(e.target.value== ""){
                setName("");
                e.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding_addfieldname")[0];
                element.style="display:block;"
  
              }else{
                setName(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
                const element:any =document.getElementsByClassName("feilmelding_addfieldname")[0];
                e.target.style="border:none;"
                element.style="display:none;"                 
              }}}/>
                <Form.Label className="feilmelding_addfieldname" style={{display:"none"}}>
                    Error i addfieldname
                </Form.Label>
                
          
          
         
          </Row>
          <Row style={{margin:"0.5rem"}}>
            <Form.Control required as="select" type="select" style={{border:"solid black 3px"}} onChange={(event:any) => {
              if(event.target.value== ""){
                setType("");
                event.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding_select")[0];
                element.style="display:block;"
              }else{
                const element:any =document.getElementsByClassName("feilmelding_select")[0];
                setType(event.target.value);
                event.target.style="border:none;"
                element.style="display:none;"  
              }
          }}>
            
              <option key={'empty'} value={''}>Choose a type</option>
              {Object.keys(props.fieldtypes).map((element:any, index:number)=>(
                <option key={index}>{element}</option>
              ))}
            </Form.Control>
           

            <Form.Label className="feilmelding_select" style={{display:"none"}}>
                  Error velg en type, prøv igjen
              </Form.Label>


          </Row>
          </Form>
    
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => {
          if(name != "" && type != ""){
            props.onClick(name, type);
            props.setShow(false);
          }    
        }}>ADD</Button>
        <Button variant='primary' onClick={() => {props.setShow(false)}}>Cancel</Button>    
        </Modal.Footer>
    </Modal>
  )
}

export default AddField
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';


import { useState } from 'react';

const AddField = (props:any) => {

    const [name, setName] = useState("");
    const [identifier,setIdentifier]= useState("");
    const [type, setType] = useState("");

  return (

    <Modal show={props.show} onHide={() => props.setShow(false)}>
        <Modal.Header><Modal.Title>Add field</Modal.Title></Modal.Header>
    
        <Modal.Body>
       <Form noValidate>
         <Form.Group>
          <Row style={{margin:"0.5rem"}}>

            <Form.Control required type='text' placeholder='Write a field name' className="add_name" id="addField_name" onChange={(e:any) => {      
              if(e.target.value== ""){
                setName("");
                e.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding_addfieldname")[0];
                element.style="display:block;"
  
              }else{
                setName(e.target.value);
                const element:any =document.getElementsByClassName("feilmelding_addfieldname")[0];
                e.target.style="border:1px solid #ced4da;"
                element.style="display:none;" 
                                
              }}}/>
                <Form.Label className="feilmelding_addfieldname" style={{display:"none"}}>
                    Invalid name
                </Form.Label>
                
          
                <Form.Control required type='text' placeholder='Write an identifier. E.g., product_id' className="add_identifier" id="addField-identifier" onChange={(e:any) => {      
                  function checkIdentifier(list:any[]){
                    for(let i = 0; i < list.length; i++){    
                        if(e.target.value==list[i].identifier){
                            return false
                           
                        }
                    }
                    return true;
                }
                if(!checkIdentifier(props.list)){
                  setIdentifier("");
                  e.target.style= "border: solid red 2px;"
                  const error:any =document.getElementsByClassName("feilmelding_likidentifieras")[0];
                  error.style="display:block; "
                  

                  const element:any =document.getElementsByClassName("feilmelding_addfieldIdentifier")[0];
                  element.style="display:none;"
                  return
              }

               else if(!/^(?!.*\.)(?!.*__)(?!.*[A-Z])(?!.*\.$)[^\W][\w.]{0,29}$/gm.test(e.target.value )){
                setIdentifier("");
                e.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding_addfieldIdentifier")[0];
                element.style="display:block;"
  
                const error:any =document.getElementsByClassName("feilmelding_likidentifieras")[0];
                error.style="display:none;"
              }else{
                setIdentifier(e.target.value);
                const element:any =document.getElementsByClassName("feilmelding_addfieldIdentifier")[0];
                e.target.style="border:1px solid #ced4da;"
                element.style="display:none;" 
                 
                const error:any =document.getElementsByClassName("feilmelding_likidentifieras")[0];
                       error.style="display:none;"
              }}}/>

                <Form.Label className="feilmelding_addfieldIdentifier" style={{display:"none"}}>
                    Invalid identifier
                </Form.Label>
         
                <Form.Label className="feilmelding_likidentifieras" style={{display:"none"}}>
                  Identifier is a duplicate, try again
                </Form.Label>
          </Row>
          <Row style={{margin:"0.5rem"}}>
            <Form.Select required style={{border:"2px solid #ced4da"}} id= "addField_select" onChange={(event:any) => {
              if(event.target.value== ""){
                setType("");
                event.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding_select")[0];
                element.style="display:block;";
              }else{
                const element:any =document.getElementsByClassName("feilmelding_select")[0];
                setType(event.target.value);
                event.target.style="border: 1px solid #ced4da;"
                element.style="display:none;"  
              }
          }}>
            
              <option key={'empty'} value={''}>Choose a type</option>
              {Object.keys(props.fieldtypes).map((element:any, index:number)=>(
                <option key={index} value={element}>{element}</option>
              ))}
            </Form.Select>
           
            <Form.Label className="feilmelding_select" style={{display:"none"}}>
                    Choose a type
                </Form.Label>
  
               
              

          </Row></Form.Group>
          </Form>
    
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={() => {
          if(name != "" && type != "" && identifier != ""){
            props.onClick(name, type,identifier);
            props.setShow(false);
            setName("")
            setType("")
            setIdentifier("")
          }else{
            if(identifier==""){
              const e:any = document.getElementsByClassName("feilmelding_likidentifieras")[0];
              if(e.style.display != "block"){
                const element:any =document.getElementsByClassName("feilmelding_addfieldIdentifier")[0];
                const er:any = document.getElementById("addField-identifier");
                er.style = "border:2px solid red;"
                element.style="display:block;" 
              }
              


            } 
            if(name==""){
              const element:any =document.getElementsByClassName("feilmelding_addfieldname")[0];
              const er:any = document.getElementById("addField_name");
              er.style = "border:2px solid red;"
              console.log(er)
              element.style="display:block;" 
            }
            if(type==""){
                
                const er:any = document.getElementById("addField_select");
                er.style=  "border:2px solid red;"
                const element:any =document.getElementsByClassName("feilmelding_select")[0];
                element.style="display:block;";
            }
             
          }    
        }} name="addField">ADD</Button>
        <Button variant='primary' name="cancel_addField" onClick={() => {props.setShow(false)}}>Cancel</Button>    
        </Modal.Footer>
    </Modal>
  )
}

export default AddField
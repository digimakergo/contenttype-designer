import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';

const EditContenttype = (props:any) => {
    const [identifier, setIdentifier] = useState(props.identifier);
    
    const validation = () => {
        
        function checkIdentifier(list:any[]){
            for(let item of Object.keys(list)){ 
                
                if(identifier==item && props.identifier != item){
                    return false
                }
            }
            return true;
        }
        let valid = true; 
        
        if(!checkIdentifier(props.contenttypes)){
            const element:any = document.getElementsByClassName("contenttype-identifier")[0];
            element.style= "border: solid red 2px;"

            let error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
            error.style="display:block; "
            
            error = document.getElementsByClassName("contenttype-error-identifier")[0];
            error.style="display:none;"
            valid = false;
        }
        else if(!/^(?!.*\.)(?!.*__)(?!.*[A-Z])(?!.*\.$)[^\W][\w.]{0,29}$/gm.test(identifier)){
          //props.contenttype.identifier = "";
          const element:any = document.getElementsByClassName("contenttype-identifier")[0];
          element.style= "border: solid red 2px;"
          
          let error:any =document.getElementsByClassName("contenttype-error-identifier")[0];
          error.style="display:block;"

          error =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
          error.style="display:none;"
          valid = false;
        }
        if(props.contenttype.name == ""){
            let element:any = document.getElementsByClassName("contenttype-name")[0];
            element.style= "border: solid red 1px;"
            element = document.getElementsByClassName("contenttype-error-name")[0];
            element.style="display:block;"
            valid = false;
        }

        if(props.contenttype.name_pattern == ""){
            let element:any = document.getElementsByClassName("contenttype-namepattern")[0];
            element.style= "border: solid red 1px;"
            element = document.getElementsByClassName("contenttype-error-namepattern")[0];
            element.style="display:block;"
            valid = false;
        }
        return valid;
      }
    

    return (
        
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>Identifier</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control className="contenttype-identifier" type="text" defaultValue={props.identifier} onChange={(e:any) => {
                            

                            function checkIdentifier(list:any[]){
                                for(let item of Object.keys(list)){ 
                                    
                                    if(e.target.value==item && props.identifier != item){
                                        return false
                                    }
                                }
                                return true;
                            }
                            if(!checkIdentifier(props.contenttypes)){
                              e.target.style= "border: solid red 2px;"
                              const error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
                              error.style="display:block; "
                              
            
                              const element:any =document.getElementsByClassName("contenttype-error-identifier")[0];
                              element.style="display:none;"
                              return
                          }
            
                           else if(!/^(?!.*\.)(?!.*__)(?!.*[A-Z])(?!.*\.$)[^\W][\w.]{0,29}$/gm.test(e.target.value )){
                            //props.contenttype.identifier = "";
                            e.target.style= "border: solid red 2px;"
                            const element:any =document.getElementsByClassName("contenttype-error-identifier")[0];
                            element.style="display:block;"
              
                            const error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
                            error.style="display:none;"
                          }else{
                            //props.contenttype.identifier = e.target.value;
                            //Object.defineProperty(props.contenttype, e.target.value, Object.getOwnPropertyDescriptor(props.contenttype, props.identifier));
                            //delete props.contenttype
                            setIdentifier(e.target.value);


                            const element:any =document.getElementsByClassName("contenttype-error-identifier")[0];
                            e.target.style="border:1px solid #ced4da;"
                            element.style="display:none;" 
                             
                            const error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
                            error.style="display:none;"
                          }
                        }}/>

                        <Form.Label className="contenttype-error-identifier" style={{display:"none"}}>
                            Invalid identifier
                        </Form.Label>
                
                        <Form.Label className="contenttype-error-identifier-equal" style={{display:"none"}}>
                            Identifier is a duplicate, try again
                        </Form.Label>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Label>Name</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control type="text" className="contenttype-name" defaultValue={props.contenttype.name} onChange={(e:any) => {
                            

                            if(e.target.value== ""){
                                props.contenttype.name = "";
                                e.target.style= "border: solid red 1px;"
                                const element:any =document.getElementsByClassName("contenttype-error-name")[0];
                                element.style="display:block;"
                  
                              }else{
                                props.contenttype.name = e.target.value;
                                const element:any =document.getElementsByClassName("contenttype-error-name")[0];
                                e.target.style="border:1px solid #ced4da;"
                                element.style="display:none;" 
                                                
                              }
                        }}/>
                        <Form.Label className="contenttype-error-name" style={{display:"none"}}>
                            Invalid name
                        </Form.Label>
                    </Col>
                </Row>

                
                <Row>
                    <Col>
                        <Form.Label>Has version</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_version} onClick={(e:any) => {
                            props.contenttype.has_version = e.target.checked;
                        }}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Label>Has location</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location} onClick={(e:any) => {
                            props.contenttype.has_location = e.target.checked;
                        }}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Label>Has location id</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location_id} onClick={(e:any) => {
                            props.contenttype.has_location_id = e.target.checked;
                        }}/>
                    </Col>
                </Row>



                

                <Row>
                    <Col>
                        <Form.Label>Name pattern</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control type="text" className="contenttype-namepattern" defaultValue={props.contenttype.name_pattern} onChange={(e:any) => {
                            if(e.target.value== ""){
                                props.contenttype.name_pattern = "";
                                e.target.style= "border: solid red 1px;"
                                const element:any =document.getElementsByClassName("contenttype-error-namepattern")[0];
                                element.style="display:block;"
                  
                              }else{
                                props.contenttype.name_pattern = e.target.value;
                                const element:any =document.getElementsByClassName("contenttype-error-namepattern")[0];
                                e.target.style="border:1px solid #ced4da;"
                                element.style="display:none;" 
                                                
                              }
                        }}/>
                        <Form.Label className="contenttype-error-namepattern" style={{display:"none"}}>
                            Invalid name pattern
                        </Form.Label>
                    </Col>
                </Row>

                <Row style={{marginTop:"1rem", marginBottom:"1rem"}}>
                    <Col>
                        <Button variant="primary" onClick={() => {
                            let element:any = document.getElementsByClassName("mainmenu")[0]
                            element.style = "transform: translateX(0%); transition: 0.5s;";
                            element = document.getElementsByClassName("editmenu")[0]
                            element.style = "transform: translate(-110%,-16%); transition: 0.5s;";
                            props.setEdit(false)
                        }} >Go back</Button>
                    </Col>
    
                    <Col lg={{span:4}} className='d-grid'>
                        <Button variant='primary' onClick={() => {
                            
                            const listids = []
                            for(let i = 0; i < props.contenttype.fields.length; i++){
                                listids[i] = i;
                            }
                            props.setListids(listids)
                            props.setList(props.contenttype.fields)
                            
                            props.setShow(false);
                            
                        }}>Edit fields</Button>
                    </Col>

            
            
            
            
            </Row>

            <Row>
                <Col className='d-grid'>
                    <Button variant='success' onClick={() => {
                        if(validation()){
                            
                            let tmp:any = {
                                identifier: identifier,
                                name: props.contenttype.name,
                                table_name: props.contenttype.table_name,
                                has_version: props.contenttype.has_version,
                                has_location: props.contenttype.has_location,
                                has_location_id: props.contenttype.has_location_id,
                                name_pattern: props.contenttype.name_pattern,
                                fields: props.contenttype.fields
                            }
                            fetch("/api/contenttypes/"+props.identifier+"/",{
                                headers:{
                                  'Content-Type':'application/json',
                                  'Accept':'application/json',
                                  'method':"PUT"
                                }
                              }).then(response => {
                                if(response.ok){
                                  return response.json();
                                }throw response;
                              }).then(data => {
                                
                                if(data.type == 'success'){
                                    console.log(data)

                                    //update identifier
                                    tmp = {};
                                    for(let c of Object.keys(props.contenttypes)){
                                        if(c != props.identifier){
                                            tmp[c] = props.contenttypes[c]
                                        }else{
                                            tmp[identifier] = props.contenttype
                                        }
                                    }
                                    props.setIdentifier(identifier)
                                    props.setContenttypes(tmp)
                                  
                                  
                                }
                              }).catch(error => {
                                console.log("Unable to get contenttype");
                              })
                        }
                    }}>Save</Button>
                </Col>
            </Row>

            </Form.Group>

            
        
    )
}

export default EditContenttype
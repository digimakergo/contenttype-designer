import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';

const EditContenttype = (props:any) => {
    const [identifier, setIdentifier] = useState(props.identifier);
    const [message, setMessage] = useState(props.message);

    
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
                <Row style={{marginBottom:"0.5rem"}}>
                <Col lg={{span:2}} className="d-grid">
                        <Button variant="primary" onClick={() => {
                            let element:any = document.getElementsByClassName("mainmenu")[0]
                            element.style = "transform: translateX(0%); transition: 0.5s;";
                            element = document.getElementsByClassName("editmenu")[0]
                            element.style = "transform: translate(-110%,-25%); transition: 0.5s;";
                            props.setEdit(false)
                            props.setAdding(false)
                            props.setIdentifier("")
                        }} ><svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" width="26" height="26" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                      </svg></Button>
                    </Col>
                </Row>
                
                <Row>
                    
                    <Col>
                        <Form.Label>Identifier</Form.Label>
                    </Col>
                    <Col sm="8" md="8" lg="8">
                        <Form.Control className="contenttype-identifier" type="text" defaultValue={props.identifier} placeholder="Choose an id name. E.g., product_id" onChange={(e:any) => {
                            

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
                    <Col sm="8" md="8" lg="8">
                        <Form.Control type="text" className="contenttype-name" defaultValue={props.contenttype.name} placeholder="Choose a name" onChange={(e:any) => {
                            

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
                    <Col sm="8" md="8" lg="8">
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_version} onClick={(e:any) => {
                            props.contenttype.has_version = e.target.checked;
                        }}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Label>Has location</Form.Label>
                    </Col>
                    <Col sm="8" md="8" lg="8">
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location} onClick={(e:any) => {
                            props.contenttype.has_location = e.target.checked;
                        }}/>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <Form.Label>Has location id</Form.Label>
                    </Col>
                    <Col sm="8" md="8" lg="8">
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location_id} onClick={(e:any) => {
                            props.contenttype.has_location_id = e.target.checked;
                        }}/>
                    </Col>
                </Row>



                

                <Row>
                    <Col>
                        <Form.Label>Name pattern</Form.Label>
                    </Col>
                    <Col sm="8" md="8" lg="8">
                        <Form.Control type="text" className="contenttype-namepattern" defaultValue={props.contenttype.name_pattern} placeholder="Choose a name pattern E.g., {title}" onChange={(e:any) => {
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
                    
    
                    <Col lg={{span:4, offset: 8}} className='d-grid'>
                        <Button disabled={props.adding} variant='primary' onClick={(e) => {
                            e.preventDefault()
                            const listids = []
                            for(let i = 0; i < props.contenttype.fields.length; i++){
                                listids[i] = i;
                            }
                            props.setListids(listids);
                            props.setList(props.contenttype.fields);
                            
                            props.setShow(false);
                            props.setHeader(props.contenttype.name)
                            
                        }}>Edit fields <img className='img' src='/images/edit1.png' style={{width:"1.8rem", marginLeft:"1rem"}}/></Button>
                    </Col>

            
            
            
            
            </Row>

            <Row>
                <Col className='d-grid'>
                    <Button variant='success' onClick={() => {
                        if(validation()){
                            
                            let tmp:any = {}
                            let url = "";
                            let method = "";
                            if(props.adding){
                                props.contenttype.table_name = "dm_"+identifier;
                                props.contenttype.fields = [];
                                tmp = {
                                    name: props.contenttype.name,
                                    table_name: props.contenttype.table_name,
                                    has_version: props.contenttype.has_version,
                                    has_location: props.contenttype.has_location,
                                    has_location_id: props.contenttype.has_location_id,
                                    fields: props.contenttype.fields,
                                    name_pattern: props.contenttype.name_pattern,
                                    
                                }
                                url = "/api/contentmodel/"+identifier+"/";
                                method = "POST";
                            }else{
                                tmp = {
                                    identifier: identifier,
                                    name: props.contenttype.name,
                                    table_name: props.contenttype.table_name,
                                    has_version: props.contenttype.has_version,
                                    has_location: props.contenttype.has_location,
                                    has_location_id: props.contenttype.has_location_id,
                                    name_pattern: props.contenttype.name_pattern,
                                    fields: props.contenttype.fields
                                } 
                                url = "/api/contentmodel/"+props.identifier+"/";
                                method = "PUT";
                            }
                            fetch(url,{
                                method:method,
                                headers:{
                                  'Content-Type':'application/json',
                                  'Accept':'application/json',
                                },
                                body: JSON.stringify(tmp)
                              }).then(response => {
                                if(response.ok){
                                  return response.json();
                                }throw response;
                              }).then(data => {
                                
                                if(data.type == 'Success'){
                                    

                                    //update identifier
                                    tmp = {};
                                    for(let c of Object.keys(props.contenttypes)){
                                        if(c != props.identifier){
                                            tmp[c] = props.contenttypes[c];
                                        }else{
                                            tmp[identifier] = props.contenttype;
                                        }
                                    }
                                    props.setIdentifier(identifier);
                                    props.setContenttypes(tmp);
                                  
                                  if(props.adding){
                                      let tmp = props.contenttypes;
                                      tmp[identifier] = props.contenttype;
                                      props.setContenttypes(tmp)
                                      props.setAdding(false);

                                      setMessage("Successfully created contenttype")

                                  }else{
                                    setMessage("Successfully updated contenttype")
                                  }
                                }
                              }).catch(error => {
                                  if(props.adding){
                                    setMessage("Unable to create contenttype");
                                  }else{
                                    setMessage("Unable to update contenttype");
                                  }
                              })
                        }
                    }}>Save</Button>
                </Col>
            </Row>

        
            <Row className='text-center'>
                <Form.Label>
                    {message}
                </Form.Label>
            </Row>

            </Form.Group>

            
        
    )
}

export default EditContenttype
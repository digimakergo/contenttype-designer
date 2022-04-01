import { Form, Row, Col, Button } from 'react-bootstrap';
import { useRef } from 'react';

const EditContenttype = (props:any) => {


    const validation = () => {
        
        function checkIdentifier(list:any[]){
            for(let i = 0; i < list.length; i++){    
                if(props.contenttype.identifier==list[i].identifier){
                    return false
                }
            }
            return true;
        }
        let valid = true; 
        if(!checkIdentifier(props.list)){
            const element:any = document.getElementsByClassName("contenttype-identifier")[0];
            element.style= "border: solid red 2px;"

            let error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
            error.style="display:block; "
            
            error = document.getElementsByClassName("contenttype-error-identifier")[0];
            element.style="display:none;"
            valid = false;
        }
        else if(!/^(?![-_.])(?!.*[-_.]{2})[a-z0-9]{1,10}/gm.test(props.contenttype.identifier )){
          //props.contenttype.identifier = "";
          const element:any = document.getElementsByClassName("contenttype-identifier")[0];
          element.style= "border: solid red 2px;"
          
          let error:any =document.getElementsByClassName("contenttype-error-identifier")[0];
          error.style="display:block;"

          error =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
          error.style="display:none;"
          valid = false;
        }

        if(props.contenttype.name != ""){
            let element:any = document.getElementsByClassName("contenttype-name")[0];
            element.style= "border: solid red 1px;"
            element = document.getElementsByClassName("contenttype-error-name")[0];
            element.style="display:block;"
            valid = false;
        }

        if(props.contenttype.name_pattern != ""){
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
                        <Form.Control className="contenttype-identifier" type="text" defaultValue={props.contenttype.identifier} onClick={(e:any) => {
                            

                            function checkIdentifier(list:any[]){
                                for(let i = 0; i < list.length; i++){    
                                    if(e.target.value==list[i].identifier){
                                        return false
                                    }
                                }
                                return true;
                            }
                            if(!checkIdentifier(props.list)){
                              e.target.style= "border: solid red 2px;"
                              const error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
                              error.style="display:block; "
                              
            
                              const element:any =document.getElementsByClassName("contenttype-error-identifier")[0];
                              element.style="display:none;"
                              return
                          }
            
                           else if(!/^(?![-_.])(?!.*[-_.]{2})[a-z0-9]{1,10}/gm.test(e.target.value )){
                            //props.contenttype.identifier = "";
                            e.target.style= "border: solid red 2px;"
                            const element:any =document.getElementsByClassName("contenttype-error-identifier")[0];
                            element.style="display:block;"
              
                            const error:any =document.getElementsByClassName("contenttype-error-identifier-equal")[0];
                            error.style="display:none;"
                          }else{
                            props.contenttype.identifier = e.target.value;
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
                        <Form.Control type="text" className="contenttype-name" defaultValue={props.contenttype.name} onClick={(e:any) => {
                            

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

                
                    {props.contenttype.identifier != "" ? <Row>
                    <Col>
                        <Form.Label>Has version</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_version} onClick={(e:any) => {
                            props.contenttype.has_version = e.target.checked;
                        }}/>
                    </Col>
                </Row> : ""}

                {props.contenttype.identifier != "" ? <Row>
                    <Col>
                        <Form.Label>Has location</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location} onClick={(e:any) => {
                            props.contenttype.has_location = e.target.checked;
                        }}/>
                    </Col>
                </Row> : ""}

                {props.contenttype.identifier != "" ? <Row>
                    <Col>
                        <Form.Label>Has location id</Form.Label>
                    </Col>
                    <Col>
                        <Form.Check type="checkbox" defaultChecked={props.contenttype.has_location_id} onClick={(e:any) => {
                            props.contenttype.has_location_id = e.target.checked;
                        }}/>
                    </Col>
                </Row> : ""}



                

                <Row>
                    <Col>
                        <Form.Label>Name pattern</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control type="text" className="contenttype-namepattern" defaultValue={props.contenttype.name_pattern} onClick={(e:any) => {
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
                            element.style = "transform: translateX(-110%); transition: 0.5s;";
                        }} >Go back</Button>
                    </Col>
    
                    <Col lg={{span:4}} className='d-grid'>
                        <Button variant='primary' onClick={() => {
                            props.setShow(false);
                        }}>Edit fields</Button>
                    </Col>

            
            
            
            
            </Row>

            <Row>
            <Col className='d-grid'><Button variant='success' onClick={() => {
                if(validation()){
                    
                }
            }}>Save</Button></Col>
            </Row>

            </Form.Group>

            
        
    )
}

export default EditContenttype
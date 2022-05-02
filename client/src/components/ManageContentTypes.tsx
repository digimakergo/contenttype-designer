import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useState, useRef } from 'react'
import EditContenttype from './EditContenttype';

const ManageContentTypes = (props:any) => {
    
    const selector:any = useRef(null);

    const [edit, setEdit] = useState(false)
    const [adding, setAdding] = useState(false);
    
    function handleRemove(){
       
        if(props.selectedKey != ""){
            
            fetch("/api/contentmodel/"+props.selectedKey+"/",{
                headers:{
                  'Content-Type':'application/json',
                  'Accept':'application/json',
                  
                },
                method:"DELETE"

              }).then(response => {
                if(response.ok){
                  return response.json();
                }throw response;
              }).then(data => {
                
                if(data.type == 'Success'){
                    const contenttypestemp:any[] = [];
                    const keys:any = Object.keys(props.contenttypes)
                    for (let contenttype of keys){
                        if(contenttype !== props.selectedKey) {
                            contenttypestemp[contenttype] = props.contenttypes[contenttype]
                        }
                    }

                    setSelected({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
                    props.setSelectedKey("")
                    props.setContenttypes(contenttypestemp);
                    selector.current?.reset()
                  
                }
              }).catch(error => {
                props.setContentManagementMessage([...props.ContentManagementMessage, "Unable to remove a contenttype"]);
              })

            
        }
    }


    const [selected, setSelected] = useState({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
    

    
    return (

        <Modal size="lg" show={props.show}>
            <Modal.Header><Modal.Title>Manage contenttypes</Modal.Title></Modal.Header>
        
            <Modal.Body style={{height: "30rem"}}>
                <Container style={{overflow:"hidden"}}>
                <Form>
                    <Form.Group className="mainmenu">
                        
                        <Row>
                            <Col lg={8}>
                            <Form.Select required style={{border:"1px solid #ced4da"}} value={props.selectedKey} id= "ManageContentTypes_select"  onChange={(e:any) => {
                                e.preventDefault()
                                if(e.target.value != ""){
                                    
                                    setSelected(props.contenttypes[e.target.value])
                                    props.setSelectedKey(e.target.value)

                                    let element:any = document.getElementById("ManageContentTypes_select");
                                   element.style = "border: solid #ced4da 1px;"
                                   
                                    element =document.getElementsByClassName("feilmelding_select")[0];
                                    element.style="display:none;"
                                }else{
                                    setSelected({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
                                    props.setSelectedKey("")
                                }
                            }}>
                                
                            
                                <option key={"contenttype-0"} value={''}>Choose a contenttype</option>
                                {Object.keys(props.contenttypes).map((contenttype:any, index:number)=>(
                                <option key={'contenttype-'+(index+1)} value={contenttype}>{props.contenttypes[contenttype].name}</option>
                                ))}



                            </Form.Select>
                            <Form.Label className="feilmelding_select" style={{display:"none"}}>
                    choose a contenttype
                </Form.Label>
                            </Col>
                            <Col lg={2} className="d-grid">
                            <Button variant="primary" name="edit_contenttype" onClick={(e) => {
                              e.preventDefault()
                                if(props.selectedKey !=''){
                                  let element:any = document.getElementsByClassName("mainmenu")[0]
                                  element.style = "transform: translateX(-110%); transition: 0.5s;"; //let element:any = 
                                  element = document.getElementsByClassName("editmenu")[0]
                                  element.style = "transform: translateX(0%); transition: 0.5s;transform: translateY(-25%);"; //let element:any = 
                                  element =document.getElementsByClassName("feilmelding_select")[0];
                                  element.style="display:none;"
                                  setEdit(true)
                                }
                                else{
                                    const event:any =document.getElementsByClassName("feilmelding_select")[0];
                                    event.style="display:block;"
                                    let element:any = document.getElementById("ManageContentTypes_select");
                                   element.style = "border: solid red 2px;"
                                }
                            }} style={{fontFamily:"sans-serif", fontSize:"1.1rem"}}>Edit<img className='img' src='/images/edit1.png' style={{width:"1.8rem", marginLeft:"1rem"}}/></Button>

                            
  
                            </Col>
                            <Col lg={2} className="d-grid">
                                
                                    <Button variant="danger" name="delete_contenttype" onClick={handleRemove} style={{font:"sans-serif", fontSize:"1.1rem"}}>Delete<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
</svg></Button>
                                    
                                
                            </Col>
                        </Row>
                        <Row style={{marginTop:"1rem"}}>
                            <Col lg={{span:10, offset:1}} className="d-grid">
                                <Button variant="primary" name="add_contenttype" onClick={() => {
                                    setSelected({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
                                    props.setSelectedKey("")
                                    setEdit(true)
                                    setAdding(true)

                                    let element:any = document.getElementsByClassName("mainmenu")[0]
                                    element.style = "transform: translateX(-110%); transition: 0.5s;"; //let element:any = 
                                    element = document.getElementsByClassName("editmenu")[0]
                                    element.style = "transform: translateX(0%); transition: 0.5s;transform: translateY(-25%);"; //let element:any = 
                                    element =document.getElementsByClassName("feilmelding_select")[0];
                                    element.style="display:none;"
                                }} style={{fontFamily:"sans-serif", fontSize:"1.1rem"}}><svg style={{transform: "scale(1.3)", marginRight:"1rem"}} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                              </svg> Add contenttype</Button>
                            </Col>
                        </Row>
                        <Row className='text-center'>
                          
                            {props.ContentManagementMessage.map((val:string, index:number) => (
                              <Form.Label key={"message-"+index} style={{marginTop:"1rem"}}>
                                {val}
                              </Form.Label>
                            ))}
                          
                        </Row>
                        
                    </Form.Group>

                    
                    <div style={{transform: "translate(110%,-25%)"}} className="editmenu">
                    {edit ? <EditContenttype contenttype={selected} identifier={props.selectedKey} setIdentifier={props.setSelectedKey} show={props.show} setShow={props.setShow} setEdit={setEdit} adding={adding} setAdding={setAdding} contenttypes={props.contenttypes} setContenttypes={props.setContenttypes} setList={props.setList} setListids={props.setListids} setShowToast={props.setShowToast} setToastMessage={props.setToastMessage} setHeader={props.setHeader} message={adding ? "To edit fields you first have to save the contenttype" : ""}/> : "" }
                    
                    </div>

                    
                </Form>
                </Container>
        
            </Modal.Body>
              
            
        </Modal>
    )
    
        
   
}

export default ManageContentTypes
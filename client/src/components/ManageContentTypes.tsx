import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useState, useRef } from 'react'
import EditContenttype from './EditContenttype';

const ManageContentTypes = (props:any) => {
    const [edit, setEdit] = useState(false)
    const[contenttypes, setContenttypes] = useState(
        [
            {
                identifier: "mine",
                name: "Mine2",
                table_name: "dm_mine",
                has_version: true,
                has_location: false,
                has_location_id: true,
                name_pattern: "{title}",
                fields: []
            },
            {
                identifier: "has",
                name: "Has",
                table_name: "dm_has",
                has_version: true,
                has_location: false,
                has_location_id: false,
                name_pattern: "{title}",
                fields: []
            },
            {
                identifier: "contenttype",
                name: "Contenttype",
                table_name: "dm_contenttype",
                has_version: true,
                has_location: false,
                has_location_id: false,
                name_pattern: "{title}",
                fields: []
            }
        ]
    );

    function handleRemove(){
        console.log(selected)
        if(selected.identifier != ""){
            console.log(selected.identifier)
            const contenttypestemp = contenttypes.filter((contenttype) => contenttype.identifier !== selected.identifier);
            setContenttypes(contenttypestemp);

            setSelected({identifier: "",name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []})
        }
    }


    const [selected, setSelected] = useState({identifier: "",name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []})

    
    return (

        <Modal show={props.show} >
            <Modal.Header><Modal.Title>Manage contenttypes</Modal.Title></Modal.Header>
        
            <Modal.Body style={{height: "25rem"}}>
                <Container style={{overflow:"hidden"}}>
                <Form>
                    <Form.Group className="mainmenu">
                        
                        <Row>
                            <Col lg={8}>
                            <Form.Select required style={{border:"1px solid #ced4da"}} id= "ManageContentTypes_select"  onChange={(e:any) => {
                                
                                if(e.target.value != ""){
                                    const index = Number(e.target.value)
                                    setSelected(contenttypes[index])

                                    let element:any = document.getElementById("ManageContentTypes_select");
                                   element.style = "border: solid #ced4da 1px;"
                                   
                                    element =document.getElementsByClassName("feilmelding_select")[0];
                                    element.style="display:none;"
                                }else{
                                    setSelected({identifier: "",name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []})
                                }
                            }}>
                                
                            
                                <option key={"contenttype-0"} value={''}>Choose a contenttype</option>
                                {contenttypes.map((contenttype:any, index:number)=>(
                                <option key={'contenttype-'+(index+1)} value={index}>{contenttype.name}</option>
                                ))}



                            </Form.Select>
                            <Form.Label className="feilmelding_select" style={{display:"none"}}>
                    choose a contenttype
                </Form.Label>
                            </Col>
                            <Col lg={2}>
                            <Button variant="primary" onClick={() => {
                                if(selected.identifier !=''){
                               let element:any = document.getElementsByClassName("mainmenu")[0]
                               element.style = "transform: translateX(-110%); transition: 0.5s;"; //let element:any = 
                               element = document.getElementsByClassName("editmenu")[0]
                               element.style = "transform: translateX(0%); transition: 0.5s;transform: translateY(-20%);"; //let element:any = 
                               element =document.getElementsByClassName("feilmelding_select")[0];
                                element.style="display:none;"
                                setEdit(true)
                                }
                                else{
                                    const event:any =document.getElementsByClassName("feilmelding_select")[0];
                                    event.style="display:block;"
                                    let element:any = document.getElementById("ManageContentTypes_select");
                                   element.style = "border: solid red 1px;"
                                }
                            }} >Edit</Button>
                 
  
                            </Col>
                            <Col lg={2}>
                            <Button variant="danger" onClick={handleRemove} >Delete</Button>
                            </Col>
                        </Row>  
                        <Button variant="primary" onClick={() => {
                    }} >Add contenttype</Button>
                    </Form.Group>

                    
                    <div style={{transform: "translate(110%,-20%)"}} className="editmenu">
                    {edit ? <EditContenttype contenttype={selected} show={props.show} setShow={props.setShow} setEdit={setEdit}/> : "" }
                    </div>
                </Form>
                </Container>
        
            </Modal.Body>
              
            
        </Modal>
    )
    
        
   
}

export default ManageContentTypes
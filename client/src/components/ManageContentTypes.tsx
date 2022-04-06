import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react'
import EditContenttype from './EditContenttype';

const ManageContentTypes = (props:any) => {
    const def:any= {}
    const[contenttypes, setContenttypes] = useState(def)
    useEffect(()=>{
        fetch('/api/contentmodel/',{
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Method':'GET'
          }
        }).then(response => {
          
          if(response.ok){
            return response.json();
          }throw response;
        }).then(data => {
          if(data.type == 'Success'){
            console.log(data)
            setContenttypes(data.response)
            
          }
        }).catch(error => {
          console.log("Unable to get contenttypes");
        })
    }, []);

    const [edit, setEdit] = useState(false)
    
    function handleRemove(){
       
        if(selectedKey != ""){
            
            fetch("/api/contentmodel/"+selectedKey+"/",{
                headers:{
                  'Content-Type':'application/json',
                  'Accept':'application/json',
                  'method':"DELETE"
                }

              }).then(response => {
                if(response.ok){
                  return response.json();
                }throw response;
              }).then(data => {
                
                if(data.type == 'success'){
                    console.log(data)
                    const contenttypestemp:any[] = [];
                    const keys:any = Object.keys(contenttypes)
                    for (let contenttype of keys){
                        if(contenttype !== selectedKey) {
                            contenttypestemp[contenttype] = contenttypes[contenttype]
                        }
                    }

                    setSelected({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
                    setSelectedKey("")
                    setContenttypes(contenttypestemp);
                  
                }
              }).catch(error => {
                console.log("Unable to get contenttype");
              })

            
        }
    }


    const [selected, setSelected] = useState({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
    const [selectedKey, setSelectedKey] = useState("")

    
    return (

        <Modal show={props.show} onHide={() => {
          props.setShow(false)
      }} >
            <Modal.Header><Modal.Title>Manage contenttypes</Modal.Title></Modal.Header>
        
            <Modal.Body style={{height: "30rem"}}>
                <Container style={{overflow:"hidden"}}>
                <Form>
                    <Form.Group className="mainmenu">
                        
                        <Row>
                            <Col lg={8}>
                            <Form.Select required style={{border:"1px solid #ced4da"}} id= "ManageContentTypes_select"  onChange={(e:any) => {
                                
                                if(e.target.value != ""){
                                    
                                    setSelected(contenttypes[e.target.value])
                                    setSelectedKey(e.target.value)

                                    let element:any = document.getElementById("ManageContentTypes_select");
                                   element.style = "border: solid #ced4da 1px;"
                                   
                                    element =document.getElementsByClassName("feilmelding_select")[0];
                                    element.style="display:none;"
                                }else{
                                    setSelected({"":{name: "",table_name: "",has_version: false,has_location: false,has_location_id: false,name_pattern: "",fields: []}})
                                    setSelectedKey("")
                                }
                            }}>
                                
                            
                                <option key={"contenttype-0"} value={''}>Choose a contenttype</option>
                                {Object.keys(contenttypes).map((contenttype:any, index:number)=>(
                                <option key={'contenttype-'+(index+1)} value={contenttype}>{contenttypes[contenttype].name}</option>
                                ))}



                            </Form.Select>
                            <Form.Label className="feilmelding_select" style={{display:"none"}}>
                    choose a contenttype
                </Form.Label>
                            </Col>
                            <Col lg={2}>
                            <Button variant="primary" onClick={() => {
                                if(selectedKey !=''){
                               let element:any = document.getElementsByClassName("mainmenu")[0]
                               element.style = "transform: translateX(-110%); transition: 0.5s;"; //let element:any = 
                               element = document.getElementsByClassName("editmenu")[0]
                               element.style = "transform: translateX(0%); transition: 0.5s;transform: translateY(-16%);"; //let element:any = 
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
                        <Row style={{marginTop:"1rem"}}>
                            <Col lg={{span:10, offset:1}} className="d-grid">
                                <Button variant="primary" onClick={() => {
                                    
                                }} >Add contenttype</Button>
                            </Col>
                        </Row>
                    </Form.Group>

                    
                    <div style={{transform: "translate(110%,-16%)"}} className="editmenu">
                    {edit ? <EditContenttype contenttype={selected} identifier={selectedKey} setIdentifier={setSelectedKey} show={props.show} setShow={props.setShow} setEdit={setEdit} list={contenttypes} setList={setContenttypes}/> : "" }
                    </div>
                </Form>
                </Container>
        
            </Modal.Body>
              
            
        </Modal>
    )
    
        
   
}

export default ManageContentTypes
import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import DragNDropComponent from './components/DragNDropComponent';
import AddField from './components/AddField';
import ListOfErrors from './components/ListOfErrors';
import ToastMessage from './components/ToastMessage';
import ManageContentTypes from './components/ManageContentTypes';

interface listElements {
  identifier:string,
  name:string,
  type:string,
  required:boolean,
  parameters?:any,
  children?:any[]
}

function App() {
  const [header, setHeader] = useState("");
  let list:listElements[];
  let setList:any;
  [list, setList] = useState([]);

  let listids:number[];
  let setListids:any;
  [listids, setListids] = useState([])
  const [fieldtypes, setFieldtypes] = useState([])
  const [showContentManager, setShowContentManager] = useState(true)

  const [toastMessage, setToastMessage] = useState("");
  const [ContentManagementMessage, setContentManagementMessage] = useState([""]);

  let def:any= {}
  const[contenttypes, setContenttypes] = useState(def)

  useEffect(()=>{

    const requests = async () => {
      const errors:string[] = [];
    let counter = 0;
    let response = await fetch('/api/contentmodel/',{
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json',
        'Method':'GET'
      }
    })

    if(response.ok){
      let data:any = await response.json();
      if(data.type == 'Success'){
        setContenttypes(data.response) 
      }else{
        errors[counter] = "Unable to get contenttypes";
        counter++;
      }
    }else{
      errors[counter] = "Unable to get contenttypes";
      counter++;
    }
    

    response = await fetch('/api/contenttype/fieldtypes/',{
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json',
        },
        method: 'GET'
    })
    if(response.ok){
      
      let data:any = await response.json();
      if(data.type == "Success"){
        setFieldtypes(data.response);
      }else{
        errors[counter] = "Unable to get field types";
        counter++;
        //setShowToast(true)
      }
    }else{
      errors[counter] = "Unable to get field types";
      counter++;
    }
    
    setContentManagementMessage(errors);
    }

    requests()
    
}, [])
  
  const [collapse, setCollapse] = useState(false);

  const Submit = (event:any) => {                      //srkiv det igjen selv
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
  def = []
  const [show, setShow] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState(def)

  const moveItem = 
    useCallback(
    (dragIndex:number, hoverIndex:number) => {
      const dragField = list[dragIndex];
      setList(
        update(list, {
          $splice:[
            [dragIndex, 1],
            [hoverIndex, 0, dragField]
          ],
        })
      );
    },
    [list],)

    const moveId = useCallback(
    (dragIndex:number, hoverIndex:number) => {
      const dragField = listids[dragIndex];
      setListids(
        update(listids, {
          $splice:[
            [dragIndex, 1],
            [hoverIndex, 0, dragField]
          ],
        })
      );
    },
    [listids],
    )
  

    
    
  
      
  

  const addContent = (name:string, type:string, identifier:string) => {
    let contentObj:listElements;
    if(type != "container"){
      contentObj = {
        identifier: identifier,
        type: type,
        name: name,
        required: false,
        parameters: {},
      }
    }else{
      contentObj = {
        identifier: identifier,
        type: type,
        name: name,
        required: false,
        children: [],
      }
    }
    setList([...list, contentObj]);
    setListids([...listids, listids.length])
    setCollapse(false);
  }
  const deleteElement=(identifier:string,index:number)=>{
    const newlist=(list.filter((any:any)=>any.identifier !== list[index].identifier))
    setList(newlist);
    const newlistids=(listids.filter((any:any)=>any !== listids[index]))
    setListids(newlistids);
  }
  
  const collapseAll = () => {
    if(!collapse){
      const allFields:any = document.getElementsByClassName("dropdown-field-menu");
      for(let field of allFields) {
        field.style = "display: none;";
      }

      const allIcons:any = document.getElementsByClassName("dropdown-field-img");
      for(let icon of allIcons) {
        icon.style = "width:3rem; float:right; transition: 500ms; transform: rotate(-90deg); cursor: pointer;";
      }
    }else{
      const allFields:any = document.getElementsByClassName("dropdown-field-menu");
      for(let field of allFields) {
        field.style = "display: block;";
      }

      const allIcons:any = document.getElementsByClassName("dropdown-field-img");
      for(let icon of allIcons) {
        icon.style = "width:3rem; float:right; transition: 500ms; cursor: pointer;";
      }
    }
    setCollapse(!collapse)
  }
 
  /*
    async function asyncCall(){
      
      
      const response = await fetch('http://localhost:8000/test');
    }
      asyncCall().catch(alert);
    }
    

    await fetch("", {
      method: 'POST',
      headers: {

      },
      body: new URLSearchParams()
    }).then(response=>{
      if(response.ok){
          return response.json();

      }
      throw response
    }).then(data=> {
      console.log(data);

    }).catch(error=>{
      
    });*/
    const contenttype = "article"

    const valid = (items:any[]) => {
      const listErr = [];
      let counter:number = 0;
      for (var i=0;i<items.length;i++){


          if(items[i].name==""){
            listErr[counter] = {
              from:items[i].identifier,
              message: "name cannot be empty",
              field:"name",
            }
            counter++;
          }
          if(items[i].identifier==""){
            listErr[counter] = {
              from:items[i].identifier,
              message: "identifier cannot be empty",
              field:"identifier",
            }
            counter++;
          }
          if(items[i].required==null){
            listErr[counter] = {
                from:items[i].identifier,
              message: " required cannot be empty",
                field:"required",
              }
              counter++;
            }
          if(items[i].type==""){
            listErr[counter] = {
              from:items[i].identifier,
              message: " type cannot be empty",
              field:"type",
            }
            counter++;
          }
          if(items[i].type == "container"){
            const tmp:any[] = valid(items[i].children)
            for(let j = 0; j < tmp.length; j++){
              listErr[counter] = tmp[j];
              counter++;
            }
          }else{
            Object.keys(fieldtypes[items[i].type]['parameters']).map((val ,index) => {
              if(fieldtypes[items[i].type]['parameters'][val] == "int" && (items[i].parameters[val] == null || isNaN(items[i].parameters[val]) || items[i].parameters[val] <= 0 || items[i].parameters[val] % 1 != 0)){
                
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }else if(fieldtypes[items[i].type]['parameters'][val] == "bool" && items[i].parameters[val] == null){
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }else if(fieldtypes[items[i].type]['parameters'][val] == "string" && (items[i].parameters[val] == null  || items[i].parameters[val] == "")){
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }
            })
          }
      }   
      return listErr;
    }

   const getList = async ()=>{


      const elements = document.getElementsByClassName("listoferrors");
      for(let i = 0; i < elements.length; i++){
        elements[i].innerHTML = "";
      }
      const errs:any[] = valid(list);
      if (errs.length >  0) {
        setErrors(errs);
        setShowErr(true)
      }else {
        const location= ("/api/contentmodel/fields/" + contenttype + "/");
        const settings= {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*",
            'mode':'no-cors'
          },
          body: JSON.stringify(list) 
        };
      try{
        const fetchResponse = await fetch(`${location}`,settings);
        await fetchResponse.json().then(data => {
          if(data.type == "error"){
            setErrors(data.response)
            setShowErr(true)
          }else{
            setToastMessage("Successfully updated the contentmodel")
            setShowToast(true)
          }
        });
        
      } catch (e){
        return e;
      }
      } 
      
      
    }
  


  return (
      <Container fluid className='App' style={{marginBottom: "1rem"}}>
        <ManageContentTypes show={showContentManager} setShow={setShowContentManager} ContentManagementMessage={ContentManagementMessage} setContentManagementMessage={setContentManagementMessage} contenttypes={contenttypes} setContenttypes={setContenttypes} setList={setList} setListids={setListids} setShowToast={setShowToast} setToastMessage={setToastMessage} setHeader={setHeader}/>
          
          <Row style={{marginBottom: "2rem"}}>
            <Col sm={{span:12}} md={{span:12}} lg={{span:12}} className="d-grid shadow-lg p-3  bg-white rounded">
              <img className="text-left" src='/images/digimakerlogo.png' style={{width:"15rem"}}/>
            </Col>
          </Row>

          <Row style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
            <Col sm={2} md={2} lg={2} className="d-grid">
              <Button variant='primary' id="collapse" onClick={() => collapseAll()} style={{fontFamily: "sans-serif", fontSize: "1.2rem"}}>Collapse all</Button>
            </Col>

            <Col sm={{span:5, offset:3}} md={{span:5, offset:3}} lg={{span:5, offset:3}}>
              <ToastMessage text={toastMessage} delay={5000} show={showToast} setShow={setShowToast}/>
            </Col>

            <Col sm={2} md={2} lg={2} className="d-grid">
              <Button variant="primary" onClick={() => {
                setShowContentManager(true)
              }} style={{fontFamily: "sans-serif", fontSize: "1.2rem"}}><svg style={{marginRight:"1rem"}} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>Manage contenttypes</Button>
            </Col>
            
          </Row>
          <Row style={{marginTop:"5rem"}}>
            <Col sm={{span:6, offset:1}} md={{span:6, offset:1}} lg={{span:6, offset:1}} className="d-grid shadow-lg p-3  bg-white rounded" style={{borderLeft:"solid #3047C2 1rem"}}>
              <h4 className="text-left" style={{fontFamily:"sans-serif", fontSize:"1.6rem"}}>You are currently editing the fields for the contenttype: <label style={{fontWeight: "bold"}}>{header}</label></h4>
            </Col>
            
          </Row>
        
        <Form style={{marginLeft:"0.5rem"}} onSubmit={Submit}>
          <DndProvider backend={HTML5Backend}>
            {list.map((field:any, index:number) => (
              <DragNDropComponent key={"drag-"+listids[index]} headerColor={index % 2 == 0 ? "#1CA4FC" : "#3047C2"} index={index} field={field} fieldid={listids[index]} moveItem={moveItem} moveId={moveId} collapsed={collapse}
                  Remove={deleteElement} parameters={fieldtypes[field.type]} list={list} fieldtypes={fieldtypes}></DragNDropComponent>
            ))}
          </DndProvider>
        </Form>

        <Row style={{marginBottom:"0.5rem", marginTop:"0.5rem"}}>
          <Col lg={{span:8, offset:2}} md={{span:8, offset:2}}  sm={{span:8, offset:2}} className="d-grid">
          <Button variant='success' size="lg" onClick={() => setShow(true)}><svg style={{transform: "scale(1.3)", marginRight:"1rem"}} xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                              </svg> Add field</Button>
          </Col>
        </Row>
        
        <AddField show={show} setShow={setShow} fieldtypes={fieldtypes} onClick={addContent} list={list}/>
       
        <Row>
          <Col className="d-grid" lg={{span:1, offset:9}} md={{span:1, offset:9}} sm={{span:1, offset:9}}>
            <Button id="submitdata" onClick={getList}  variant="primary" style={{fontFamily: "sans-serif", fontSize: "1.2rem"}}>
              Submit
            </Button>
          </Col>
        </Row>
        
        <Col lg={2}></Col>
        <ListOfErrors show={showErr} setShow={setShowErr} errors={errors} list={list}/>
      </Container>
  );

}


export default App
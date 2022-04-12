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
    

    response = await fetch('/api/contenttypes/fieldtypes/',{
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
        console.log("sda")
        console.log(data)
        errors[counter] = "Unable to get field types";
        counter++;
        //setShowToast(true)
      }
    }else{
      console.log("sda")
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

            Object.keys(fieldtypes[items[i].type]['parameters']).map((val ,index) => {
              if(fieldtypes[items[i].type]['parameters'][val] == "int" && items[i].parameters[val] == null  && items[i].parameters[val] > 0){
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }

              if(fieldtypes[items[i].type]['parameters'][val] == "bool" && items[i].parameters[val] == null  && items[i].parameters[val] == true){
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }

              if(fieldtypes[items[i].type]['parameters'][val] == "string" && items[i].parameters[val] == null  && items[i].parameters[val] == ""){
                listErr[counter] = {
                  from:items[i].identifier,
                  message: val + " has incorrect data",
                  field: val,
                }
                counter++;
              }
            })
      }   
      return listErr;
    }

   const getList = async ()=>{

      const errs:any[] = valid(list);
      if (errs.length >  0) {
        setErrors(errs);
        setShowErr(true)
      }else {
        const location= ("/api/contentmodel/" + contenttype + "/");
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
            console.log(data)
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
    <div className="App">
      <Container fluid>
        <ManageContentTypes show={showContentManager} setShow={setShowContentManager} ContentManagementMessage={ContentManagementMessage} setContentManagementMessage={setContentManagementMessage} contenttypes={contenttypes} setContenttypes={setContenttypes} setList={setList} setListids={setListids} />
          <Row style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
            <Col sm={2} md={2} lg={2} className="d-grid">
              <Button variant='primary' id="collapse" onClick={() => collapseAll()}>Collapse all</Button>
            </Col>

            <Col sm={{span:5, offset:3}} md={{span:5, offset:3}} lg={{span:5, offset:3}}>
              <ToastMessage text={toastMessage} delay={5000} show={showToast} setShow={setShowToast}/>
            </Col>

            <Col sm={2} md={2} lg={2} className="d-grid">
              <Button variant="primary" onClick={() => {
                setShowContentManager(true)
              }} >Back to main menu</Button>
            </Col>
            
          </Row>
        
        <Form style={{paddingTop:"1rem", marginLeft:"0.5rem"}} onSubmit={Submit}>
          <DndProvider backend={HTML5Backend}>
            {list.map((field:any, index:number) => (
              <DragNDropComponent key={"drag-"+listids[index]} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index} field={field} fieldid={listids[index]} moveItem={moveItem} moveId={moveId} collapsed={collapse}
                  Remove={deleteElement} parameters={fieldtypes[field.type]} list={list} fieldtypes={fieldtypes}></DragNDropComponent>
            ))}
          </DndProvider>
        </Form>

        <Row style={{marginBottom:"0.5rem", marginTop:"0.5rem"}}>
          <Col lg={{span:8, offset:2}} md={{span:8, offset:2}}  sm={{span:8, offset:2}} className="d-grid">
          <Button variant='success' size="lg" onClick={() => setShow(true)}>+ Add field</Button>
          </Col>
        </Row>
        
        <AddField show={show} setShow={setShow} fieldtypes={fieldtypes} onClick={addContent} list={list}/>
       
        <Row>
          <Col className="d-grid" lg={{span:1, offset:9}} md={{span:1, offset:9}} sm={{span:1, offset:9}}>
            <Button id="submitdata" onClick={getList}  variant="primary">
              Submit
            </Button>
          </Col>
        </Row>
        
        <Col lg={2}></Col>
        <ListOfErrors show={showErr} setShow={setShowErr} errors={errors}/>
      </Container>
    </div>
  );

}


export default App
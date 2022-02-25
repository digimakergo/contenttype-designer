import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Form, Container, Button, Row, Col } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Field from './components/Field';
import DragNDropComponent from './components/DragNDropComponent';
import DropDownContentTypes from './components/DropDownContentTypes';
import AddField from './components/AddField';
import ListOfErrors from './components/ListOfErrors';
import ToastMessage from './components/ToastMessage';


interface listElements {
  identifier:string,
  name:string,
  type:string,
  required:boolean,
  parameters?:any,
  children?:any[]
}

function App() {

  const [fieldtypes, setFieldtypes] = useState([])

  useEffect(()=>{
    fetch('FieldTypeDefinition.json',{
        headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
        }
    }).then(response => {
        if(response.ok){
            return response.json();
        }
        throw response;
    }).then(data => {
        setFieldtypes(data);
    }).catch(error => {
        console.log("error: " + error);
    })
}, [])
  
  const [collapse, setCollapse] = useState(false);
  const[validated, setValidated] = useState(true);

  const Submit = (event:any) => {                      //srkiv det igjen selv
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  const [show, setShow] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState([])
  let list:listElements[];
  let setList:any;
  [list, setList] = useState([]);

  const moveItem = useCallback(
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
    [list],
  )

  const addContent = (name:string, type:string) => {
    let contentObj:listElements;
    if(type != "container"){
      contentObj = {
        identifier: name.toLowerCase().replaceAll(" ","_"),
        type: type,
        name: name,
        required: false,
        parameters: {},
      }
    }else{
      contentObj = {
        identifier: name.toLowerCase().replaceAll(" ","_"),
        type: type,
        name: name,
        required: false,
        children: [],
      }
    }
    
      setList([...list, contentObj]);
      setCollapse(false);
  }
  const deleteElement=(identifier:string)=>{
    const newlist=(list.filter((any:any)=>any.identifier !== identifier))
    setList(newlist);
  }
  const collapseAll = () => {
    if(!collapse){
      const allFields:any = document.getElementsByClassName("dropdown-field-menu");
      for(let field of allFields) {
        field.style = "display: None;";
      }

      const allIcons:any = document.getElementsByClassName("dropdown-field-img");
      for(let icon of allIcons) {
        icon.style = "width:3rem; float:right; transition: 500ms; transform: rotate(-90deg); cursor: pointer;";
      }
    }else{
      const allFields:any = document.getElementsByClassName("dropdown-field-menu");
      for(let field of allFields) {
        field.style = "display: Block;";
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

   const getList = async ()=>{
      const location= ('/api/contentmodelhandler/');
      const settings= {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': "*",
          'mode':'no-cors'

        },
        body: JSON.stringify(list) 
      };
     
      
      try{
        const fetchResponse = await fetch(`${location}`,settings);
        const data = await fetchResponse.json();
        return data;
        
      } catch (e){
        return e;
      }
    }
  


  return (
    <div className="App">
      <Container>
        <Row style={{marginTop:"0.5rem", marginBottom:"0.5rem"}}>
          <Col xs={3} md={3} lg={3}>
            <Button variant='primary' style={{marginLeft:"-7.5rem"}} onClick={() => collapseAll()}>Collapse all</Button>
          </Col>

          <Col xs={6} md={6} lg={6}>
            <ToastMessage text="Successfully updated the contentmodel" delay={5000} show={showToast} setShow={setShowToast}/>
          </Col>
          
        </Row>
        
        <Form style={{paddingTop:"1rem", marginLeft:"0.5rem"}} //noValidate
       
       onSubmit={Submit}>
          
          <DndProvider backend={HTML5Backend}>
            {list.map((field:any, index:number) => (
              <DragNDropComponent key={field.identifier} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index} identifier={field.identifier} fieldname={field.name} moveItem={moveItem} collapsed={collapse}
                  Remove={deleteElement} >
                <Field field={field} index={index} fieldtypes={fieldtypes} parameters={fieldtypes[field.type]}/>
              </DragNDropComponent>
            ))}
          </DndProvider>
          <Form.Group>
         <Button id="submitdata" onClick={ () => {
           
            getList().then(data => {
              if(data.type == "error"){
                setErrors(data.response)
                setShowErr(true)
              }else{
                setShowToast(true)
              }
            }
          )
         }
           
           }  variant="primary" size="lg">
        Submit
      </Button>
      </Form.Group>
        </Form>
        <Button variant='success' style={{width:"50rem", height:"3rem" , marginLeft:"10rem", marginTop:"1rem"}} onClick={() => setShow(true)}>+ Add field</Button>
        <AddField show={show} setShow={setShow} fieldtypes={fieldtypes} onClick={addContent}/>
        <ListOfErrors show={showErr} setShow={setShowErr} errors={errors}/>
      </Container>
    </div>
  );

}


export default App
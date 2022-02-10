import { useState, useCallback } from 'react';
import './App.css';
import { Form, Container, Button } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Field from './components/Field';
import DragNDropComponent from './components/DragNDropComponent';
import DropDownContentTypes from './components/DropDownContentTypes';




function App() {
  
  const [collapse, setCollapse] = useState(false);
  const [list, setList] = useState([
    {
      identifier: "body",
      name: "Body",
      type: "",
      required: false,
      parameters: {},
    },
    {
      identifier: "summary",
      name: "Summary",
      type: "Text",
      required: true,
      parameters: {max_length:5,is_multi_line: true},
    }
    ,
    {
      identifier: "container",
      name: "Container",
      type: "Container",
      required: true,
      children: [],
    }
  ]);

  

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

  const addContent = (value:string) => {
    const contentObj = {
      identifier: value.toLowerCase().replaceAll(" ","_"),
      type: "",
      name: value,
      required: false,
      parameters: {},
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
        icon.style = "width:2rem; float:right; transition: 500ms; transform: rotate(-90deg); cursor: pointer;";
      }
    }else{
      const allFields:any = document.getElementsByClassName("dropdown-field-menu");
      for(let field of allFields) {
        field.style = "display: Block;";
      }

      const allIcons:any = document.getElementsByClassName("dropdown-field-img");
      for(let icon of allIcons) {
        icon.style = "width:2rem; float:right; transition: 500ms; cursor: pointer;";
      }
    }
    setCollapse(!collapse)
  }
  return (
    <div className="App">
      <Container>
        <Button variant='primary' onClick={() => collapseAll()}>Collapse all</Button>
        <Form style={{marginTop:"1rem"}}>
          
          <DndProvider backend={HTML5Backend}>
            {list.map((field:any, index:number) => (
              <DragNDropComponent key={field.identifier} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index} identifier={field.identifier} fieldname={field.name} moveItem={moveItem}
                  Remove={deleteElement} >
                <Field field={field} index={index}/>
              </DragNDropComponent>
            ))}
          </DndProvider>

          <DropDownContentTypes onClick={addContent}/>
        </Form>
      </Container>
    </div>
  );
}

export default App;
import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { Form, Container, Button } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Field from './components/Field';
import DragNDropComponent from './components/DragNDropComponent';
import DropDownContentTypes from './components/DropDownContentTypes';




function App() {
  

  const [list, setList] = useState([
    {
      identifier: "body",
      name: "Body",
      type: "",
      required: false,
      parameters: {},
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
      console.log(value);
  }
  const deleteElement=(identifier:string)=>{
    const newlist=(list.filter((any:any)=>any.identifier !== identifier))

    setList(newlist);
    console.log(identifier);
   
  }
  const collapseAll = () => {
    const allFields:any = document.getElementsByClassName("dropdown-field-menu");
    for(let field of allFields) {
      field.style = "display: None;";
    }
  }
  return (
    <div className="App">
      <Container>
        <Form>
          <Button variant='primary' onClick={() => collapseAll()}>Collapse all</Button>
          <DndProvider backend={HTML5Backend}>
            {list.map((field:any, index:number) => (
              <DragNDropComponent key={field.id} index={index} identifier={field.identifier} fieldname={field.name} moveItem={moveItem}
                  Remove={deleteElement} >
                <Field field={field}/>
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
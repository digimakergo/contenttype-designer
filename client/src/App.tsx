import { useState, useCallback } from 'react';
import './App.css';
import { Form, Row, Container } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Field from './components/Field';
import DragNDropComponent from './components/DragNDropComponent';
import DropDownContentTypes from './components/DropDownContentTypes';




function App() {
  let i = 2;
  const contentType = ["Title", "Summary", "Body", "Coverimage", "Relations", "Editors"];
  

  
  const [list, setList] = useState([
    {
      id: 1,
      identifier: "body",
      type: "",
      name: "Body",
      required: false,
      parameters: {},
    },
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

  const onSubmit = () => {
    console.log("submitting to the server!");
  }
  const onSubmitSuccess = () => {
    console.log("submitting to the server succeded!");
  }
  const onSubmitFailed = () => {
    console.log("submitting to the server failed!");
  }
  

  const addContent = (value:string) => {
    const contentObj = {
      id: i,
      identifier: value.toLowerCase().replaceAll(" ","_"),
      type: "",
      name: value,
      required: false,
      parameters: {},
    }
    i++;
      setList([...list, contentObj]);
      console.log(value);
  }
  return (
    <div className="App">
      <Container>
      <Form>  
      
        <DndProvider backend={HTML5Backend}>
        {list.map((field:any, index:number) => (
            
              <DragNDropComponent key={field.id} index={index} id={field.id} fieldname={field.name} moveItem={moveItem}>
                <Field field={field}/>
              </DragNDropComponent>
            
          ))}
        
        </DndProvider>
        
        
      </Form>
      </Container>
      
      <DropDownContentTypes contenttype={contentType} onClick={addContent} />
     
    </div>
  );
}

export default App;

/*
for the drag and drop


{list.map((field:any, index:number) => (
            <DragNDropComponent key={field.id} index={index} id={field.id} txt={field.txt} moveItem={moveItem}>
              <Boarding />
            </DragNDropComponent>
          ))}
          
*/


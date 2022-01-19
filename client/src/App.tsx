import { useState, useCallback } from 'react';
import './App.css';
import { Form, Container } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Summary from './components/Summary';
import Title from './components/Title';
//import Boarding from './components/Boarding';
//import DragNDropComponent from './components/DragNDropComponent';




function App() {

  

  const [list, setList] = useState([
    {
      id: 1,
      txt: "s"
    },
    {
      id: 2,
      txt:"d"
    },
    {
      id: 3,
      txt:"sd"
    },

  ]);

  const moveItem = useCallback(
    (dragIndex:number, hoverIndex:number) => {
      const dragField = list[dragIndex]
      setList(
        update(list, {
          $splice:[
            [dragIndex, 1],
            [hoverIndex, 0, dragField]
          ],
        }),
      )
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
  
  return (
    <div className="App">
      <Container>
      <Form>  
        <DndProvider backend={HTML5Backend}>
          
          
        </DndProvider>
        <Title />
        <Summary />

      </Form>
      </Container>
      
      
     
    </div>
  );
}

export default App;

/*{list.map((field:any, index:number) => (
            <DragNDropComponent key={field.id} index={index} id={field.id} txt={field.txt} moveItem={moveItem}>
              <Boarding txt={field.txt}/>
            </DragNDropComponent>
          ))} */

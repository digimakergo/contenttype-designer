import './App.css';
import { Form, Container } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';




function App() {

  const onSubmit = () => {
    console.log("submitting to the server!");
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


      </Form>
      </Container>
     
    </div>
  );
}

export default App;

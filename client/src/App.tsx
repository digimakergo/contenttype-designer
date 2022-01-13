import './App.css';
import { Form } from 'antd';
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
      <Form
        name="form"
        labelCol={{span: 8}}
        wrapperCol={{span: 4}}
        initialValues={{remember:true}}
        onFinish={onSubmit}
        onFinishFailed={onSubmitFailed}
        autoComplete='off'
      >
        <DndProvider backend={HTML5Backend}>
          
        </DndProvider>


      </Form>
     
    </div>
  );
}

export default App;

import { Form, Col, Row, Button, Placeholder} from 'react-bootstrap';
import { useState } from 'react';

const DropDownContentTypes = (props:any) => {
    const [value, setValue] = useState("")
   
return (
    <Row style = {{marginTop:"2rem"}}>
        <Col xs md lg={{span: 4,offset: 5}} style={{marginLeft:"39rem"}} >
        <Form.Control type='text' placeholder='Write a field name'  onChange={(e) => {
            setValue(e.target.value.charAt(0).toUpperCase()+e.target.value.slice(1));
        }}/>
    </Col>
    <Col>
    <Button variant="primary" onClick={() => {
        props.onClick(value);
    }
    }>ADD</Button>
    </Col>
    </Row>
)
};

/*<Form.Select style = {{border:"solid black 3px"}} onChange={(event) => {
        setValue(event.target.value)
    } }>
        <option>Choose contentTypes</option>
        {props.contenttype.map((element:string)=>(
            <option>{element}</option>
        ) )}

    </Form.Select> */

export default DropDownContentTypes;




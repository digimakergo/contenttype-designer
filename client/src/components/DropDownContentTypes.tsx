import { Form, Col, Row, Button} from 'react-bootstrap';
import { useState } from 'react';

const DropDownContentTypes = (props:any) => {
    const [value, setValue] = useState("Choose contentTypes")
   
return (
    <Row style = {{marginTop:"2rem"}}>
        <Col xs md lg={{span: 4,offset: 5}} style={{marginLeft:"39rem"}} >
    <Form.Select style = {{border:"solid black 3px"}} onChange={(event) => {
        setValue(event.target.value)
    } }>
        <option>Choose contentTypes</option>
        {props.contenttype.map((element:string)=>(
            <option>{element}</option>
        ) )}

    </Form.Select>
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

export default DropDownContentTypes;




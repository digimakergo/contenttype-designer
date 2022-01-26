import { Form, Col, Row, Button} from 'react-bootstrap';

const DropDownContentTypes = (props:any) => {
    
return (
    <Row style = {{marginTop:"2rem"}}>
        <Col xs md lg={{span: 4,offset: 5}} style={{marginLeft:"39rem"}} >
    <Form.Select style = {{border:"solid black 3px"}}>
        <option>Choose contentTypes</option>
        {props.contenttype.map((element:string)=>(
            <option>{element}</option>
        ) )}

    </Form.Select>
    </Col>
    <Col>
    <Button variant="primary">ADD</Button>
    </Col>
    </Row>
)
};

export default DropDownContentTypes;




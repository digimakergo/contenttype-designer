import { Form, Col, Row} from 'react-bootstrap';

const DropDownContentTypes = (props:any) => {
    
return (
    <>
    <Form.Select>
        <option>Choose contentTypes</option>
        {props.contenttype.map((element:string)=>(
            <option>{element}</option>
        ) )}
    </Form.Select>

    </>
)
};

export default DropDownContentTypes;




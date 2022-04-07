import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Field from './Field';
import Remove from './Remove';

const FieldContainer = (props:any) => {
    let headerstyle = {};
    if(props.headerColor != null){
        headerstyle = {backgroundColor: props.headerColor}
    }else{
        headerstyle = {backgroundColor: "grey"};
    }


    const [dropDownContent, setDropDownContent] = useState(true);
    const dropdown = () => {
        setDropDownContent(!dropDownContent)
    }
    
    const deleteElement=(identifier:string)=>{
        const newlist=(props.list.filter((field:any)=>field.identifier !== identifier))
        props.setChildren(newlist);
        props.parent.children = newlist;
    }
  return (
    <Form.Group>
        <Row>
            <Col xs="10" md="10" lg="10" style={{border:"solid black 0.1rem"}}>
                
                    <Row className='align-items-center' style={headerstyle}>
                        <Col xs="11" md="11" lg="11"><h2 style={{color:"white"}}>{props.field.name}</h2></Col>
                        <Col><img onClick={dropdown} className='dropdown-field-img' style={dropDownContent ? {width:"2rem", float:"right", transition: "500ms", cursor: "pointer"} : {width:"2rem", float:"right", transition: "500ms", transform: "rotate(-90deg)", cursor: "pointer"}} src='./images/dropdownicon.png'/></Col>
                    </Row>                
                    <Row  className='dropdown-field-menu' style={ !dropDownContent ? {display:"None"} : {}}>
                        <Field field={props.field} index={props.index} fieldtypes={props.fieldtypes} parameters={props.parameters} list={props.list} identifier={props.identifier} setFieldname={props.setFieldname} />
                    </Row>
                
            </Col>
            <Col xs="2" md="2" lg="2">
                <Remove element={props.field.identifier} Remove={deleteElement} />
            </Col>
        </Row>
    </Form.Group>
  );
};

export default FieldContainer;

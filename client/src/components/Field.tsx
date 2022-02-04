import { Form, Row, Col, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Container from './Container';
import DropDownContentTypes from './DropDownContentTypes';

interface ParamElements {
    label:string,
    type:any
}
interface ParamElementsC {
    identifier: string,
                type: string,
                name: string,
                required: boolean,
                parameters: any
}

const Field = (props:any) => {
    
    const [fields, setFields] = useState({});
    const def:ParamElements[] = [];

    
    
    const [params, setParams] = useState(def);
    const [children, setChildren] = useState(props.field.children);

    useEffect(()=>{
        fetch('FieldTypeDefinition.json',{
            headers:{
                'Content-Type':'application/json',
                'Accept':'application/json'
            }
        }).then(response => {
            if(response.ok){
                return response.json();
            }
            throw response;
        }).then(data => {
            setFields(data)
        }).catch(error => {
            console.log("error: " + error);
        })
    }, [])


    
    const addContent = (value:string) => {
        if(props.field.children != null){
            const contentObj = {
                identifier: value.toLowerCase().replaceAll(" ","_"),
                type: "",
                name: value,
                required: false,
                parameters: {},
            }

            setChildren([...children, contentObj])
            props.field.children.push(contentObj)

            
            
        }
    }
    const getFormControl = (type:string, element:ParamElements) =>{    
        if(type === 'int'){
            props.field.parameters[element.label] = 0;
            return (
                <Form.Control type='number' onChange={(e) => {
                    props.field.parameters[element.label] = e.target.value; 
                }}/>
            )
        }else if(type === 'bool'){
            props.field.parameters[element.label] = false;
            return (
                <Form.Check onClick={(e:any) => {
                    props.field.parameters[element.label] = e.target.checked;
                }}/>
            )
        }else if(type.indexOf("radio") != -1){
            props.field.parameters[element.label] = "";
            const radiobuttons = type.split(":")[1].split(",");
            const name = "group"+props.index;
            return radiobuttons.map((value, index) => (
            
                <Form.Check inline name={name} id={`inline-radio-${index}`} key={index} label={value} type={'radio'} onClick={(e:any) => {
                    if(e.target.checked){
                        props.field.parameters[element.label] = value;
                    }
                }}/>
            ));

        }else if(type.indexOf("check") != -1){
            props.field.parameters[element.label] = "";
            const radiobuttons = type.split(":")[1].split(",");
            
            return radiobuttons.map((value, index) => (
                <Form.Check inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'checkbox'} onClick={(e:any) => {
                    if(e.target.checked){
                        if(props.field.parameters[element.label] != ""){
                            props.field.parameters[element.label] += "," + value;
                        }else{
                            props.field.parameters[element.label] = value;
                        }
                    }else{
                        if(props.field.parameters[element.label] != ""){
                            if(props.field.parameters[element.label].indexOf(","+value) != -1){
                                props.field.parameters[element.label] = props.field.parameters[element.label].replace(","+value, "");
                            }else{
                                if(props.field.parameters[element.label].indexOf(value+",") != -1){
                                    props.field.parameters[element.label] = props.field.parameters[element.label].replace(value+",", "");
                                }else{
                                    props.field.parameters[element.label] = props.field.parameters[element.label].replace(value, "");
                                }
                            }
                        }
                    }
                }}/>
            ));

        }/*else if(type == "list"){
            props.field.parameters[element.label] = "";
            const def:string[] = [];
            params

            
            
            return (
                <>
                    <Row>
                        {list.map((listval:string, index:number) => (
                            <>
                            <Form.Control type='text' onChange={(e) => {
                                list[index] = e.target.value;
                            }}>Name</Form.Control>
                            <Form.Control type='text' onChange={(e) => {
                                list[index] = e.target.value;
                            }}>Value</Form.Control>
                            </>
                        ))}
                        
                    </Row>
                    <Row>
                        <Button variant='primary' value='Add' onClick={() => {
                            setList([...list,""]);
                        }}/>
                    </Row>
                </>
            );

        }*/
        
        return;
    }

    

    const addParameter = (val:any) => {
        props.field.parameters = {};
        let elements:ParamElements[] = [];
        let key:any;
        let value:any;
        for([key, value] of Object.entries(fields)){
            if(key === val){
                props.field.type = val;
                for(let [label, type] of Object.entries(value.parameters)){
                    
                    elements.push({'label': label, 'type': type});   
                }
                setParams(elements);       
            }
        }
        if(val === "Choose a type"){props.field.type = "";}
    }

    return (
        <> 
        <Row className='justify-content-start'>
        <Col xs md lg="1">
            <Form.Label style={{textAlign:"left"}} column sm="2" >
                Name
            </Form.Label>
        </Col>
        <Col >
            <Form.Control type = "text" defaultValue={props.field.name} onChange={(e:any) => {
            props.field.name = e.target.value;   
            }}/>
        </Col>          
</Row>
        <Row className='justify-content-start'>
                <Col xs md lg="1">
                    <Form.Label style={{textAlign:"left"}} column sm="2" >
                        Identifier   
                    </Form.Label>
                </Col>
                <Col >
                    <Form.Control type = "text"  placeholder="Choose an id name. E.g., product_id" onChange={(e:any) => {
                        
                     props.field.identifier = e.target.value;
                    
                    }}/>
                </Col>          
        </Row>
        
   <Row className='justify-content-start'>
                <Col xs md lg="1">
                    <Form.Label style={{textAlign:"left"}} column sm="2" >
                        Type    
                    </Form.Label>
                </Col>
                <Col>
                    <Form.Select defaultValue={props.field.type} style={{border:"solid black 3px"}} onChange={(event) => {
                        addParameter(event.target.value)
                    } }>
                        <option>Choose a type</option>
                        {Object.keys(fields).map((element:any, index:number)=>(
                            <option key={index}>{element}</option>
                        ) )}

                    </Form.Select>    
                </Col>
            </Row>
            

            <Row className='justify-content-start'>

            <Col xs lg="1">
                    <Form.Label style={{textAlign:"left"}} column sm="2" >
                    Required    
                    </Form.Label>
                </Col>
                <Col >
                <Form.Check type="checkbox" value={props.field.required} onClick={(e:any) => {
                    props.field.required = e.target.checked;
                }}/>
                </Col>
                
            </Row>

            {
                props.field.children == null ? 
                params.map((element:any, index:number) => 
                        <Row key={index} className='justify-content-start'>
                        <Col xs lg="1">
                            <Form.Label style={{textAlign:"left"}} column sm="2" >
                            {(element.label).replace()}   
                            </Form.Label>
                        </Col>
                        <Col >
                            {getFormControl(element.type, element)}
                        </Col>
                    </Row>
                      
                ) : 
                
                <>
                    {children.map((field:any, index:number) => (
                        <Container list={children} setChildren={setChildren} key={index} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index} identifier={field.identifier} fieldname={field.name}>
                            <Field field={field} index={index}/>
                        </Container>
                        )
                    )}
                    <DropDownContentTypes onClick={addContent}/>
                </>
            }
        </>
    )
}

export default Field;
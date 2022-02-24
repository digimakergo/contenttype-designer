import { Form, Row, Col, Button } from 'react-bootstrap';

import React, { useState, useEffect } from 'react';
import FieldContainer from './FieldContainer';
import DropDownContentTypes from './DropDownContentTypes';
import AddField from './AddField';



interface ParamElements {
    label:string,
    type:any
}

interface listElements {
    identifier:string,
    name:string,
    type:string,
    required:boolean,
    parameters?:any,
    children?:any[]
  }

const Field = (props:any) => {
    const def:ParamElements[] = [];
    const [params, setParams] = useState(def);
    const [children, setChildren] = useState(props.field.children);
    const [show, setShow] = useState(false);
    
    const addContent = (name:string, type:string) => {
        let contentObj:listElements;
        if(type != "container"){
            contentObj = {
                identifier: name.toLowerCase().replaceAll(" ","_"),
                type: type,
                name: name,
                required: false,
                parameters: {},
            }
        }else{
            contentObj = {
                identifier: name.toLowerCase().replaceAll(" ","_"),
                type: type,
                name: name,
                required: false,
                children: [],
            }
        }
        setChildren([...children, contentObj])
        props.field.children.push(contentObj)
    }
    const getFormControl = (type:string, element:string) =>{
        if(type === 'int'){
            props.field.parameters[element] = 0;
            return (
                <Form.Control className={props.field.identifier + "-" + element} type='number' defaultValue={props.field.parameters[element]} onChange={(e) => {
                    props.field.parameters[element] = Number(e.target.value);
                }}/>
            )
        }else if(type === 'bool'){
            props.field.parameters[element] = false;
            return (
                <Form.Check className={props.field.identifier + "-" + element} onClick={(e:any) => {
                    props.field.parameters[element] = e.target.checked;
                }}/>
            )
        }else if(type.indexOf("radio") != -1){
            props.field.parameters[element] = "";
            const radiobuttons = type.split(":")[1].split(",");
            const name = "group"+props.index;
            return radiobuttons.map((value, index) => (
            
                <Form.Check inline name={name} id={`inline-radio-${index}`} key={index} label={value} type={'radio'} className={props.field.identifier + "-" + element} onClick={(e:any) => {
                    if(e.target.checked){
                        props.field.parameters[element] = value;
                    }
                }}/>
            ));

        }else if(type.indexOf("check") != -1){
            props.field.parameters[element] = "";
            const radiobuttons = type.split(":")[1].split(",");
            
            return radiobuttons.map((value, index) => (
                <Form.Check inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'checkbox'} className={props.field.identifier + "-" + element} onClick={(e:any) => {
                    if(e.target.checked){
                        if(props.field.parameters[element] != ""){
                            props.field.parameters[element] += "," + value;
                        }else{
                            props.field.parameters[element] = value;
                        }
                    }else{
                        if(props.field.parameters[element] != ""){
                            if(props.field.parameters[element].indexOf(","+value) != -1){
                                props.field.parameters[element] = props.field.parameters[element].replace(","+value, "");
                            }else{
                                if(props.field.parameters[element].indexOf(value+",") != -1){
                                    props.field.parameters[element] = props.field.parameters[element].replace(value+",", "");
                                }else{
                                    props.field.parameters[element] = props.field.parameters[element].replace(value, "");
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

    

    /*const addParameter = (val:any) => {
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
    }*/

    const render = () => {
        
        if(props.field.type != "container" && props.parameters != null){
            return (
                    Object.keys(props.parameters['parameters']).map((element:any, index:number) => (
                        <Row key={index} className='justify-content-start'>
                        <Col xs={2} md={2} lg={2}>
                            <Form.Label style={{textAlign:"left"}} column>
                            {element.replaceAll("_", " ")}   
                            </Form.Label>
                        </Col>
                        <Col >
                            {getFormControl(props.parameters['parameters'][element], element)}
                        </Col>
                    </Row>
                    )
                  
                )
            )
        }else if(props.field.type === "container"){
            return (
                <>
                    {children.map((field:any, index:number) => (
                        <FieldContainer list={children} parent={props.field} field={field} setChildren={setChildren} key={index} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index}>
                            <Field field={field} index={index} fieldtypes={props.fieldtypes} parameters={props.fieldtypes[field.type]} />
                        </FieldContainer>
                        )
                    )}
                    <Button onClick={() => setShow(true)}>+ add field</Button>
                    <AddField show={show} setShow={setShow} fieldtypes={props.fieldtypes} onClick={addContent}/>
                </>
            )
        }
        
    }

    return (
        <> 

        <Row className='justify-content-start'>
        <Col xs={2} md={2} lg={2}>
       
            <Form.Label style={{textAlign:"left"}} column sm="2" >
                Name
            </Form.Label>
            
        </Col>
        <Col >
            
            <Form.Control className={props.field.identifier + "-name"} required type = "text"  defaultValue={props.field.name} onChange={(e:any) => {
            props.field.name = e.target.value;  
            }}/>
              <Form.Control.Feedback type="invalid">
              Please write a name.
             </Form.Control.Feedback>

        </Col>          
</Row>
        <Row className='justify-content-start'>
                <Col xs={2} md={2} lg={2}>
                    <Form.Label style={{textAlign:"left"}} column >
                        Identifier   
                    </Form.Label>
                </Col>
                <Col >
                    <Form.Control className={props.field.identifier + "-identifier"} required type = "text"  placeholder="Choose an id name. E.g., product_id" onChange={(e:any) => {
                        
                     props.field.identifier = e.target.value;
                    
                    }}/>
                    <Form.Control.Feedback type="invalid">
            Please write an identifier
          </Form.Control.Feedback>
                </Col> 
                     
        </Row>
        
        
    
        
   <Row className='justify-content-start'>
                <Col xs={2} md={2} lg={2}>
                    <Form.Label className={props.field.identifier + "-type"} style={{textAlign:"left"}}>
                        Type    
                    </Form.Label>
                </Col>
                <Col>
                    <Form.Label >{props.field.type}</Form.Label>    
                </Col>
            </Row>
            

            <Row className='justify-content-start'>

                <Col xs={2} md={2} lg={2}>
                    <Form.Label style={{textAlign:"left"}} >
                        Required
                    </Form.Label>
                </Col>
                <Col >
                <Form.Check className={props.field.identifier + "-required"} type="checkbox" value={props.field.required} onClick={(e:any) => {
                    props.field.required = e.target.checked;
                }}/>
                </Col>
                
            </Row>
            

            {render()}
            
        </>
    )
}

export default Field;
import { Form, Row, Col } from 'react-bootstrap';
import React, { SetStateAction, useEffect, useState } from 'react';

interface ParamElements {
    label:string,
    type:any
}

const Field = (props:any) => {

    const [fields, setFields] = useState({});
    const def:ParamElements[] = [];
    const [params, setParams] = useState(def);


    useEffect(()=>{
        fetch('fieldtype.json',{
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
            
            return radiobuttons.map((value, index) => (
                <Form.Check inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'radio'} onClick={(e:any) => {
                    if(e.target.checked){
                        props.field.parameters[element.label] = value;
                    }
                }}/>
            ));

        }
        
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

                
                params.map((p) => {
                    elements.push(p);
                })
                
                for(let [label, type] of Object.entries(value.parameters)){
                    elements.push({'label': label, 'type': type});   
                }
                setParams(elements);       
            }
        }
        if(params.length != 0){
            setParams([])
        }
    }

    return (
        <>
            <Row className='justify-content-start'>
                <Col xs md lg="1">
                    <Form.Label style={{textAlign:"left"}} column sm="2" >
                        Type    
                    </Form.Label>
                </Col>
                <Col >
                    <Form.Control type="text"  onChange={(event) => {addParameter(event.target.value)}}/>
                </Col>
                
            </Row>
            

            <Row className='justify-content-start'>

            <Col xs lg="1">
                    <Form.Label style={{textAlign:"left"}} column sm="2" >
                    Required    
                    </Form.Label>
                </Col>
                <Col >
                <Form.Check type="checkbox" onClick={(e:any) => {
                    props.field.required = e.target.checked;
                }}/>
                </Col>
                
            </Row>

            {
                params.map((element:any, index:number) => (
                    <Row key={index} className='justify-content-start'>
                        <Col xs lg="1">
                            <Form.Label style={{textAlign:"left"}} column sm="2" >
                            {element.label}   
                            </Form.Label>
                        </Col>
                        <Col >
                            {getFormControl(element.type, element)}
                        </Col>
                    </Row>  
                ))
            }
        </>
    )
}

export default Field;
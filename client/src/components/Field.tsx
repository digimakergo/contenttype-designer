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

    const getFormControl = (type:string) =>{
        if(type === 'int'){
            return (
                <Form.Control type='int' />
            )
        }else if(type === 'bool'){
            return (
                <Form.Check />
            )
        }else if(type.indexOf("radio") != -1){
            const radiobuttons = type.split(":")[1].split(",");
            
            return radiobuttons.map((value, index) => (
                <Form.Check inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'radio'} />
            ));

        }
        return;
    }

    

    const addParameter = (val:any) => {
       let elements:ParamElements[] = [];
        let key:any;
        let value:any;
        for([key, value] of Object.entries(fields)){
            if(key === val){
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
                <Col xs lg="1">
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
                <Form.Check type="checkbox"/>
                </Col>
                
            </Row>

            {params.map((element:any, index:number) => (
                <div key={index}>
                    <Row className=''>
                        <Form.Label  column sm="2" >
                            {element.label}    
                        </Form.Label>
                    </Row>
                    <Row>
                        {getFormControl(element.type)}
                    </Row>
                </div>
                ))}
        </>
    )
}

export default Field;
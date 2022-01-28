import { Form, Row, Col, Button } from 'react-bootstrap';
import React, { SetStateAction, useEffect, useState } from 'react';

interface ParamElements {
    label:string,
    type:any
}

const Field = (props:any) => {

    const [fields, setFields] = useState({});
    const def:ParamElements[] = [];
    const [params, setParams] = useState(def);
    //console.log(props.field);
    //props.field.map((fields:any) => {
    //    setParams([...params, {label}])
    //}


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

        }else if(type.indexOf("check") != -1){
            props.field.parameters[element.label] = "";
            const radiobuttons = type.split(":")[1].split(",");
            
            return radiobuttons.map((value, index) => (
                <Form.Check inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'checkbox'} onClick={(e:any) => {
                    if(e.target.checked){
                        props.field.parameters[element.label] = value;
                    }
                }}/>
            ));

        }/*else if(type == "list"){
            props.field.parameters[element.label] = "";
            const [list, setList] = useState([]);

            
            
            return (
                <>
                    {list.map((listval:string, index:number) => (
                        <Form.Control type='text' onChange={(e) => {
                            list[index] = e.target.value;
                        }}/>
                    ))}
                    <Button variant='primary' value='Add' onClick={() => {
                        list.push("");
                    }}/>
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

        if(val === "Choose a type"){props.field.type = "";}
        console.log(props.field)
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

                <Form.Select style = {{border:"solid black 3px"}} onChange={(event) => {
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
                params.map((element:any, index:number) => (
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
                ))
            }
        </>
    )
}

export default Field;
import { Form, Row } from 'react-bootstrap';
import { SetStateAction, useEffect, useState } from 'react';

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
                <Form.Label style={{textAlign:"left"}} column sm="2" >
                    ContentType    
                </Form.Label>
            </Row>
            <Row>
                <Form.Control type="text" readOnly={true} value={props.fieldname}/>
            </Row>

            <Row className='justify-content-start'>
                <Form.Label style={{textAlign:"left"}} column sm="2" >
                    Type    
                </Form.Label>
            </Row>
            <Row>
                <Form.Control type="text"  onChange={(event) => {addParameter(event.target.value)}}/>
            </Row>

            <Row className='justify-content-start'>
                <Form.Label style={{textAlign:"left"}} column sm="2" >
                    Required    
                </Form.Label>
            </Row>
            <Row>
                <Form.Check type="checkbox"/>
            </Row>
            {params.map((element:any, index:number) => (
                <div key={index}>
                    <Row className='justify-content-start'>
                        <Form.Label style={{textAlign:"left"}} column sm="2" >
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
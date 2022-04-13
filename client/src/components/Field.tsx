import { Form, Row, Col, Button } from 'react-bootstrap';
import { useState } from 'react';
import FieldContainer from './FieldContainer';
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
    
    const addContent = (name:string, type:string, identifier:string) => {
        let contentObj:listElements;
        if(type != "container"){
            contentObj = {
                identifier: identifier,
                type: type,
                name: name,
                required: false,
                parameters: {},
            }
        }else{
            contentObj = {
                identifier: identifier,
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

        if(props.field.parameters == null){
            props.field.parameters = {};
        }

        if(type === 'int'){
            if(props.field.parameters[element] == null){
                props.field.parameters[element] = 0;
                
            }
            
            return (
                <Form.Control className={props.field.identifier + "-" + element} type='number' defaultValue={props.field.parameters[element]} onChange={(e:any) => {
                    const val = Number(e.target.value);
                    
                    if(val > 0){
                        props.field.parameters[element] = val;
                        e.target.style= "border: solid red 2px;border:none;"
                    }else {
                        e.target.style="border: solid red 2px;"
                    }
                }}/>
            )
        }else if(type === 'string'){
            if(props.field.parameters[element] == null){
                props.field.parameters[element] = "";
            }
            
            return (
                <Form.Control className={props.field.identifier + "-" + element} type='text' defaultValue={props.field.parameters[element]} onChange={(e) => {
                    props.field.parameters[element] = (e.target.value);
                }}/>
            )
        }else if(type === 'bool'){
            if(props.field.parameters[element] == null){
                props.field.parameters[element] = false;
            }
            //use indexOf in defaultvaluie field to check if it should be checked
            return (    
                <Form.Check defaultChecked={props.field.parameters[element]} className={props.field.identifier + "-" + element} onClick={(e:any) => {
                    props.field.parameters[element] = e.target.checked;
                }}/>
            )
        }else if(type.indexOf("radio") != -1){
            if(props.field.parameters[element] == null){
                props.field.parameters[element] = "";
            }

            const radiobuttons = type.split(":")[1].split(",");
            const name = "group"+props.index;
            return radiobuttons.map((value, index) => (
            
                <Form.Check defaultChecked={props.field.parameters[element].indexOf(value) != -1} inline name={name} id={`inline-radio-${index}`} key={index} label={value} type={'radio'} className={props.field.identifier + "-" + element} onClick={(e:any) => {
                    if(e.target.checked){
                        props.field.parameters[element] = value;
                    }
                }}/>
            ));

        }else if(type.indexOf("check") != -1){
            if(props.field.parameters[element] == null){
                props.field.parameters[element] = "";
            }

            const radiobuttons = type.split(":")[1].split(",");
            //also use IndexOf here OR split but indexOf is simpler
            return radiobuttons.map((value, index) => (
                <Form.Check defaultChecked={props.field.parameters[element].indexOf(value) != -1} inline name="group1" id={`inline-radio-${index}`} key={index} label={value} type={'checkbox'} className={props.field.identifier + "-" + element} onClick={(e:any) => {
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
                
                    {children ? children.map((field:any, index:number) => (
                        <FieldContainer key={"drag-"+props.fieldid+"-"+index} headerColor={index % 2 == 0 ? "#1CA4FC" : "#498EBA"} index={index} field={field} fieldid={props.fieldid}  collapsed={props.collapse}
                        parameters={props.parameters} list={children} setChildren={setChildren} fieldtypes={props.fieldtypes} parent={props.field}/>
                        )
                    ): null}
                    
                    <Button onClick={() => setShow(true)}>+ add field</Button>
                    <AddField show={show} setShow={setShow} fieldtypes={props.fieldtypes} list={props.list} onClick={addContent}/>
                    
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
            if(e.target.value== ""){
                props.field.name = "";
                e.target.style= "border: solid red 2px;"
                const element:any =document.getElementsByClassName("feilmelding")[0];
                element.style="display:block;"

            }else{
                const element:any =document.getElementsByClassName("feilmelding")[0];
                props.field.name = e.target.value;
                props.setFieldname(e.target.value);
                e.target.style="border:1px solid #ced4da;"
                element.style="display:none;"
                  
               
                
            }}}/>
              <Form.Label className="feilmelding" style={{display:"none"}}>
                  Error i name, prøv igjen
              </Form.Label>
              
              

        </Col>          
</Row>
        <Row className='justify-content-start'>
                <Col xs={2} md={2} lg={2}>
                    <Form.Label style={{textAlign:"left"}} column >
                        Identifier   
                    </Form.Label>
                </Col>
                <Col >
                    <Form.Control className={props.field.identifier + "-identifier identifiers"} required type = "text"  placeholder="Choose an id name. E.g., product_id" defaultValue={props.field.identifier} onChange={(e:any) => {
                        let index = props.index;
                        function checkIdentifier(list:any[]){
                            let index = props.index;
                            for(let i = 0; i < list.length; i++){
                                
                                if(e.target.value==list[index%list.length].identifier){
                                    return false
                                   
                                }
                                index++;
                            }
                            return true
                        }

                        if(!checkIdentifier(props.list)){
                            const error:any =document.getElementsByClassName("feilmelding_likidentifier")[index];
                            error.style="display:block;"

                            const element:any =document.getElementsByClassName("feilmelding_identifier")[index];
                        element.style="display:none;"
                            return
                        }
                       else if(!/^(?!.*\.)(?!.*__)(?!.*[A-Z])(?!.*\.$)[^\W][\w.]{0,29}$/gm.test(e.target.value )){
                    
                        props.field.identifier = ""; // ikke la identiifer være tom
                        e.target.style= "border: solid red 2px;"
                        const element:any =document.getElementsByClassName("feilmelding_identifier")[index];
                        element.style="display:block;"

                        const error:any =document.getElementsByClassName("feilmelding_likidentifier")[index];
                                    error.style="display:none;"
                        
        
                    }else{
                        const element:any =document.getElementsByClassName("feilmelding_identifier")[index];
                        props.field.identifier = e.target.value;
                        //props.setIdentifier(e.target.value)
                        //props.setIdentifierUpdated()
                        //console.log(e)   
                        e.target.style="border:1px solid #ced4da;"
                        element.style="display:none;"

                        const error:any =document.getElementsByClassName("feilmelding_likidentifier")[index];
                                    error.style="display:none;"

                       /* console.log("serrr")
                        const l = []
                        for(let i = 0; i < props.list.length; i++){
                            l[i] = props.list[i];
                        }
                        props.settList(l);
                        //Reload()
                        
                        */

                        //console.log(props.list)
                    }
                   
                    
                    }}/>
                      <Form.Label className="feilmelding_identifier" style={{display:"none"}}>
                          Error in identifier, try again
                      </Form.Label>

                      <Form.Label className="feilmelding_likidentifier" style={{display:"none"}}>
                         identifier is a duplicate, try again
                      </Form.Label>

                </Col> 
                     
        </Row>
        
        
    
        
   <Row className='justify-content-start'>
                <Col xs={2} md={2} lg={2}>
                    <Form.Label style={{textAlign:"left"}}>
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
                <Form.Check type="checkbox" defaultChecked={props.field.required} onClick={(e:any) => {
                    props.field.required = e.target.checked;
                }}/>
                </Col>
                
            </Row>
            

            {render()}
            
        </>
    )
}

export default Field;
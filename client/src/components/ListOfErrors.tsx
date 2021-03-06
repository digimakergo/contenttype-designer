import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';

const ListOfErrors = (props:any) => {
  return (
    <Modal show={props.show} onHide={() => {
        props.setShow(false)
    }} restoreFocus={false}>
    <Modal.Header><Modal.Title>List of errors</Modal.Title></Modal.Header>

    <Modal.Body>
        {props.errors.map((error:any, index:number) => (
            <Row key={"error-"+index}>
                <Button style={{color:"red", textDecoration:"underline"}} onClick={() => {
                    
                    
                    function finn(list:any[], id:string){
                        for(let i = 0; i < list.length; i++){
                            
                            if(list[i].identifier == error.from){
                                
                                return id+"-"+i;
                            }
                            else if(list[i].type == "container"){
                                id = finn(list[i].children, id+"-"+i);
                                
                            }
                            
                        }
                        return id;
                    }
                    const tmp = finn(props.list,"id")
                    const element = document.getElementById(tmp);
                    element?.scrollIntoView();
                    props.setShow(false);
    
                    document.getElementsByClassName("listoferrors-"+tmp)[0].innerHTML=error.message;
                }} variant="default">{error.message}</Button>
            </Row>
        ))}
    </Modal.Body>
    <Modal.Footer>
        <Button name="hide-errors"variant='primary' onClick={() => {
            props.setShow(false)
        }}>Cancel</Button>
    </Modal.Footer>
</Modal>
  )
}

export default ListOfErrors
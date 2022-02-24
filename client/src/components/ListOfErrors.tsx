import Modal from 'react-bootstrap/modal';
import Button from 'react-bootstrap/button';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';

const ListOfErrors = (props:any) => {
    const [s, ss] = useState("");
  return (
    <Modal show={props.show} onHide={() => {props.setShow(false)
        const element = document.getElementById(s);
        document.getElementById("submitdata")?.blur()
        element?.focus()
    }
    
    
    }>
    <Modal.Header><Modal.Title>List of errors</Modal.Title></Modal.Header>

    <Modal.Body>
        {props.errors.map((error:any, index:number) => (
            <Row key={"error-"+index}>
                <a href="#" style={{color:"red", textDecoration:"underline"}} onClick={() => {
                    //document.getElementById("submitdata")?.blur()
                    //const element:any = document.querySelectorAll('.'+error.from + "-" + error.field)[0]
                    const element = document.getElementById(error.from+"-form");
                    element?.focus()
                    console.log(element)
                    ss(error.from+"-form")
                    
                   

                    //element.scrollTo();
                    
                    //window.scrollTo(0 ,element.getBoundingClientRect().top) 
                    

                }}>{error.message}</a>
            </Row>
        ))}
    </Modal.Body>
    <Modal.Footer>
        <Button variant='primary' onClick={() => {
            props.setShow(false)
            
            }}>Cancel</Button>
    </Modal.Footer>
</Modal>
  )
}

export default ListOfErrors
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import React from 'react'

const ManageContentTypes = (props:any) => {
    const contenttypes = [
        {
            identifier: "mine",
            name: "Mine2",
        },
        {
            identifier: "has",
            name: "Has",
        },
        {
            identifier: "contenttyp",
            name: "Contenttype",
        }
    ]
    return (

        <Modal show={props.show} onHide={() => props.setShow(false)}>
            <Modal.Header><Modal.Title>Manage contenttypes</Modal.Title></Modal.Header>
        
            <Modal.Body>
                <Container>
                <Form>
                    <Form.Group>
                        
                        <Row>
                            <Col lg={8}>
                            <Form.Select required style={{border:"1px solid #ced4da"}} id= "ManageContentTypes_select"  onChange={(e:any) => {

                            }}>
                                
                            
                                <option key={"contenttype-0"} value={''}>Choose a contenttype</option>
                                {contenttypes.map((contenttype:any, index:number)=>(
                                <option key={'contenttype-'+(index+1)} value={contenttype.identifier}>{contenttype.name}</option>
                                ))}



                            </Form.Select>
                            </Col>
                            <Col lg={2}>
                            <Button variant="primary" onClick={() => { }} >Edit</Button>
                            </Col>
                            <Col lg={2}>
                            <Button variant="danger" onClick={() => { }} >Delete</Button>
                            </Col>
                        </Row>  
                            
                    </Form.Group>

                </Form>
                </Container>
        
            </Modal.Body>
            <Modal.Footer>
            <Button variant="primary" onClick={() => {
            }} >Add contenttype</Button>
            <Button variant='primary' onClick={() => {props.setShow(false)}}>Cancel</Button>    
            </Modal.Footer>
        </Modal>
    )
    
        
   
}

export default ManageContentTypes
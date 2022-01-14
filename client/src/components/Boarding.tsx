import { Form, Row, Col } from 'react-bootstrap';

const Boarding = () => {//do we remove the required or not use the field if empty.
    return (

        
        <Form.Group className="mb-3 boarding" controlId="boarding">
            <Row className='justify-content-start'>
            <Form.Label style={{textAlign:"left"}}column sm="2" >
                Boarding    
            </Form.Label>
            </Row>
            
            <Form.Control type="text"/>
            
        </Form.Group>

        
        
    )
}

export default Boarding;
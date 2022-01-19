import { Form, Row } from 'react-bootstrap';


const Boarding = (props:any) => {

    return (
        <>
            <Row className='justify-content-start'>
                <Form.Label style={{textAlign:"left"}}column sm="2" >
                    Boarding    
                </Form.Label>
            </Row>
            <Row>
                <Form.Control type="text"/>
            </Row>
        </>
    )
}

export default Boarding;
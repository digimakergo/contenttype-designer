import { Form, Row, Col } from 'react-bootstrap';


const Boarding = (props:any) => {

    return (
        <>
            <Row className='justify-content-start'>
                <Form.Label style={{textAlign:"left"}}column sm="2" >
                    Boarding    
                </Form.Label>
            </Row>
            <Row>
                <Form.Control type="text" value={props.txt}/>
            </Row>
        </>
    )
}

export default Boarding;
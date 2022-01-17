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

/*<div  style={ isDragging ? {backgroundColor: "black"} : {}} >
        <Form.Group  className="mb-3 boarding" controlId="boarding">
            <Row>
                <Col className="col-11">
                    <Row className='justify-content-start'>
                        <Form.Label style={{textAlign:"left"}}column sm="2" >
                            Boarding    
                        </Form.Label>
                    </Row>
                    <Form.Control type="text" value={props.txt}/>
                </Col>
                <Col className="col-1">
                    <Move handlerId={handlerId} ref={drag} />
                </Col>
            </Row>
        </Form.Group>
        </div> */



        /*<div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      
    </div> */

export default Boarding;
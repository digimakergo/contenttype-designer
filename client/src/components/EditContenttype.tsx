import { Form, Row, Col } from 'react-bootstrap';

const EditContenttype = (props:any) => {
  return (
    <Form>
        <Form.Group>
            <Row>
                <Col>
                    <Form.Label>Identifier</Form.Label>
                </Col>
                <Col>
                    <Form.Control type="text" defaultValue={props.contenttype.identifier} onClick={(e:any) => {
                        props.contenttype.identifier = e.target.value;
                    }}/>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>Name</Form.Label>
                </Col>
                <Col>
                    <Form.Control type="text" defaultValue={props.contenttype.name} onClick={(e:any) => {
                        props.contenttype.name = e.target.value;
                    }}/>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>Has location</Form.Label>
                </Col>
                <Col>
                    <Form.Control />
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label>Has version</Form.Label>
                </Col>
                <Col>
                    <Form.Control />
                </Col>
            </Row>
            
        </Form.Group>
    </Form>
  )
}

export default EditContenttype
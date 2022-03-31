import { Form, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

const EditContenttype = (props:any) => {
  return (
    
        <Form.Group className="editmenu">
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

                

                </Col>

                
            </Row>
            <Col>
            <Button variant="primary" onClick={(

            ) => {
                let element:any = document.getElementsByClassName("mainmenu")[0]
                               element.style = "transform: translateX(0%); transition: 0.5s;"; //let element:any = 
                               element = document.getElementsByClassName("editmenu")[0]
                               element.style = "transform: translateX(-110%); transition: 0.5s;"; //let element:any = 
                    }} >Previous</Button>
            </Col>
        </Form.Group>
    
  )
}

export default EditContenttype
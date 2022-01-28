import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Remove = () => {
    return (
       <Row>
         <Col className="col-4">
                    <img alt='remove field'   src="/images/remove.png" className="img" style={{width:"2rem"}}/>    
                </Col>
                <Col className="col-8 justify-content-center align-item-center">
                    <p className="p">Move</p>
                </Col>
       </Row>
    )
}

export default Remove

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Move = (props:any) => {
    return (
        <Row>
            <Col className="col-4">
                <img alt='move field' src="/images/move.png" className="img" style={{width:"2rem"}}/>    
            </Col>
            <Col className="col-8 justify-content-center align-item-center">
                <p className="p">Move</p>
            </Col>
        </Row>        
    )
}

export default Move;
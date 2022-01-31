import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Remove = (props:any) => {
    return (
       <Row>
         <Col className="col-4">
                    <img alt='remove field'   src="/images/remove.png" onClick={()=>{props.Remove(props.element)}} className="img" style={{width:"2rem"}}
                    /> 
                       
                </Col>
                <Col className="col-8 justify-content-center align-item-center">
                    <p className="p">Remove</p>
                </Col>

       </Row>
    )
}

export default Remove

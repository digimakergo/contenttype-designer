import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Remove = (props:any) => {
    return (
       <Row style={{marginTop:"0.5rem"}} onClick={()=>{
           props.Remove(props.element, props.index)}}>
         <Col className="col-4" >
                    <img alt='remove field'   src="/images/remove.png" className="img" style={{width:"2rem"}}
                    /> 
                       
                </Col>
                <Col className="col-8 justify-content-center align-item-center">
                    <p className="p" style={{fontFamily: "sans-serif", fontSize: "1.4rem"}}>Remove</p>
                </Col>

       </Row>
    )
}

export default Remove

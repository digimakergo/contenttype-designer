import Toast from 'react-bootstrap/Toast';

const ToastMessage = (props:any) => {
  return (
    <Toast onClose={() => {props.setShow(false)}} show={props.show} delay={props.delay} style={{position:"fixed",backgroundColor: props.state}} autohide>
        <Toast.Body style={{color:"#FFFFFF", fontFamily:"sans-serif", fontSize:"1rem"}}>
            {props.text}
        </Toast.Body>

    </Toast>
  )
}

export default ToastMessage;
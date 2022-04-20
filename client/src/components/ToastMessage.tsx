import Toast from 'react-bootstrap/Toast';

const ToastMessage = (props:any) => {
  return (
    <Toast onClose={() => {props.setShow(false)}} show={props.show} delay={props.delay} style={{position:"fixed"}} autohide>
        <Toast.Body>
            {props.text}
        </Toast.Body>

    </Toast>
  )
}

export default ToastMessage;
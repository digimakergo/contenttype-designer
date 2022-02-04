import { useRef, useState} from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import Move from './Move';
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from 'dnd-core';
import { ItemTypes } from './ItemTypes';
import Remove from './Remove';


interface DragItem {
    index:number,
    identifier:string,
    type:string
}

const DragNDropComponent = (props:any) => {
    let headerstyle = {};
    if(props.headerColor != null){
        headerstyle = {backgroundColor: props.headerColor}
    }else{
        headerstyle = {backgroundColor: "grey"};
    }

    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.FIELD,
        collect (monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor: DropTargetMonitor) {
            
            if(!ref.current){
                return
            }

            const dragIndex = item.index;
            const hoverIndex = props.index;

            if(dragIndex === hoverIndex){
                return
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddelY = (hoverBoundingRect.bottom - hoverBoundingRect.top) /2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if(dragIndex < hoverIndex && hoverClientY < hoverMiddelY){
                return
            }
            if(dragIndex > hoverIndex && hoverClientY > hoverMiddelY){
                return
            }
            props.moveItem(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    }
    );
    const index = props.index;
    const identifier = props.identifier;

    const [{ isDragging }, drag, prev] = useDrag({
        type:ItemTypes.FIELD,
        item: () => {
            return { identifier, index }
        },
        collect: (monitor:any) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref))

    const [dropDownContent, setDropDownContent] = useState(true);
    const dropdown = () => {
        setDropDownContent(!dropDownContent)
    }


    return (
        <Form.Group className="boarding" controlId="boarding" ref={prev} style={{opacity: opacity}}>
            <Row>
                <Col xs="10" md="10" lg="10" style={{border:"solid black 0.1rem"}}>
                    
                        <Row className='align-items-center' style={headerstyle}>
                            <Col xs="11" md="11" lg="11"><h2 style={{color:"white"}}>{props.fieldname}</h2></Col>
                            <Col><img onClick={dropdown} className='dropdown-field-img' style={dropDownContent ? {width:"2rem", float:"right", transition: "500ms", cursor: "pointer"} : {width:"2rem", float:"right", transition: "500ms", transform: "rotate(-90deg)", cursor: "pointer"}} src='./images/dropdownicon.png'/></Col>
                        </Row>                
                        <Row  className='dropdown-field-menu' style={ !dropDownContent ? {display:"None"} : {}}>
                            {props.children}
                        </Row>
                    
                </Col>
                <Col xs="1" md="1" lg="1">
                    <Move ref={ref} handlerId={handlerId} />    
                </Col>
                <Col xs="1" md="1" lg="1">
                    <Remove element={props.identifier} Remove={props.Remove}/>
                </Col>
            </Row>
        </Form.Group>
    )
}

export default DragNDropComponent;

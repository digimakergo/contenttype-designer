import { useRef, useState} from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import Move from './Move';
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from 'dnd-core';
import { ItemTypes } from './ItemTypes';

interface DragItem {
    index:number,
    id:string,
    type:string
}

const DragNDropComponent = (props:any) => {

    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.FIELD,
        collect (monitor) {
            return {
                handlerId: !!monitor.getHandlerId(),
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
    let id = props.id;
    let index = props.index;
    const [{ isDragging }, drag] = useDrag({
        type:ItemTypes.FIELD,
        item: () => {
            return { id, index}
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
        <Form.Group  className="boarding" controlId="boarding" style={{opacity: opacity}}>
            <Row>
            <Col xs md lg="10">
                <div  style={{border:"solid black 0.1rem", padding:"0.5rem"}}  >
                    
                        <Row className='identifier align-items-center'>
                            <Col xs md lg="11"><h2>{props.fieldname}</h2></Col>
                            <Col ><img onClick={dropdown} style={{width:"2rem", float:"right"}} src='./images/dropdownicon.png'/></Col>
                        </Row>
                        
                    <Row className='' style={ !dropDownContent ? {display:"None"} : {}}>
                        {props.children}
                    </Row>
                </div>
            </Col>
            <Col xs md lg="2" ref={ref}  data-handler-id={props.handlerId}>
                <Move  />
            </Col>
            </Row>
        </Form.Group>
    )
}

export default DragNDropComponent

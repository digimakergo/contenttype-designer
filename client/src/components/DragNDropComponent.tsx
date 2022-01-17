import { useRef} from 'react';
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
    const [{ handlerId }, drop] = useDrop(() => ({
        accept: ItemTypes.Image,
        collect: (monitor) => ({
            handlerId: !!monitor.getHandlerId(),
        }),
        hover(item: DragItem, monitor: DropTargetMonitor) {
            if(!ref.current){
                return;
            }

            const dragIndex = item.index;
            const hoverIndex = props.index;

            if(dragIndex === hoverIndex){
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddelY = (hoverBoundingRect.bottom - hoverBoundingRect.top) /2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if(dragIndex < hoverIndex && hoverClientY < hoverMiddelY){
                return;
            }
            if(dragIndex > hoverIndex && hoverClientY > hoverMiddelY){
                return;
            }

            props.moveItem(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    })
    );
    const id = props.id;
    const index = props.index;
    const [{ isDragging }, drag] = useDrag(() => ({
        type:ItemTypes.Image,
        item: () => {
            return { id, index}
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }));

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref))


    return (
        <div ref={ref}  data-handler-id={props.handlerId} style={{border: "solid black"}}  >
            <Form.Group  className="mb-3 boarding" controlId="boarding">
            <Row>
                <Col className="col-10">
                    {props.children}
                </Col>
                <Col className="col-1">
                    <Move  ref={ref} handlerId={handlerId}/>
                </Col>
            </Row>
        </Form.Group>
        </div>
    )
}

export default DragNDropComponent
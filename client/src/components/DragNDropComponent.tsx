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

    const dropdown = () => {
            
        const col:any = document.getElementById("dropdown-field-menu-"+props.identifier);
        const img:any = document.getElementById("dropdown-field-img-"+props.identifier);

        console.log(col.style.display)
        if(col.style.display == "block"){
            col.style = "display: none;"
            img.style = "width:3rem; float: right; transition: 500ms; transform: rotate(-90deg); cursor: pointer;"
        }else{
            col.style = "display: block;"
            img.style = "width: 3rem; float:right; transition: 500ms; cursor: pointer;"
            
        }
            
    }

    return (
        <Form.Group key={props.identifier} controlId={props.identifier} id={props.identifier+"-form"} ref={prev} style={{opacity: opacity, marginTop:"1rem"}}>
            <Row>
                <Col xs="10" md="10" lg="10" style={{border:"solid black 0.1rem"}}>
                    
                        <Row style={headerstyle}>
                            <Col xs="6" md="6" lg="6"><h2 style={{color:"white"}}>{props.fieldname}</h2></Col>
                            <Col xs="2" md="2" lg="2"><Move ref={ref} handlerId={handlerId} /></Col>
                            <Col xs={{span:"2", offset:"2"}} md={{span:"2", offset:"2"}} lg={{span:"2", offset:"2"}}>
                                <img onClick={dropdown} className='dropdown-field-img' id={"dropdown-field-img-"+props.identifier} style={{width:"3rem", float:"right", transition: "500ms", cursor: "pointer"}}
                                     src='./images/dropdownicon.png'/>
                                </Col>
                        </Row>                
                        <Row  className='dropdown-field-menu' id={"dropdown-field-menu-"+props.identifier} style={{display:"block"}}>
                            {props.children}
                        </Row>
                    
                </Col>
                
                <Col xs="2" md="2" lg="2">
                    <Remove element={props.identifier} Remove={props.Remove}/>
                </Col>
            </Row>
        </Form.Group>
    )
}

export default DragNDropComponent;

import { useRef, useState} from 'react';
import { Form, Col, Row} from 'react-bootstrap';
import Move from './Move';
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from 'dnd-core';
import { ItemTypes } from './ItemTypes';
import Remove from './Remove';
import Field from './Field';


interface DragItem {
    index:number,
    identifier:string,
    type:string
}

const DragNDropComponent = (props:any) => {
    const [identifier, setIdentifier] = useState(props.field.identifier)
    const [fieldname, setFieldname] = useState(props.field.name)
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
            props.moveId(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    }
    );
    const index = props.index;
    const id = props.fieldid;


    const [{ isDragging }, drag, prev] = useDrag({
        type:ItemTypes.FIELD,
        item: () => {
            return {  id, index }
        },
        collect: (monitor:any) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref))

    const dropdown = () => {
            
        const col:any = document.getElementById("dropdown-field-menu-"+props.index);
        const img:any = document.getElementById("dropdown-field-img-"+props.index);

        if(col.style.display == "block"){
            col.style = "display: none;"
            img.style = "width:3rem; float: right; transition: 500ms; transform: rotate(-90deg); cursor: pointer;"
        }else{
            col.style = "display: block;"
            img.style = "width: 3rem; float:right; transition: 500ms; cursor: pointer;"
            
        }
            
    }

    return (
        <Form.Group key={identifier} controlId={identifier} id={props.index}  ref={prev} style={{opacity: opacity, marginTop:"1rem"}}>
            <Row>
                <Col xs={{span:8, offset:1}} md={{span:8, offset:1}} lg={{span:8, offset:1}} style={{border:"solid black 0.1rem"}}>
                    
                        <Row style={headerstyle}>
                            <Col xs="8" md="8" lg="8"><h2 style={{color:"white"}}>{fieldname}</h2></Col>
                            <Col xs={{span:"2", offset:"2"}} md={{span:"2", offset:"2"}} lg={{span:"2", offset:"2"}}>
                                <img onClick={dropdown} className='dropdown-field-img' id={"dropdown-field-img-"+props.index} style={{width:"3rem", float:"right", transition: "500ms", cursor: "pointer"}}
                                     src='/images/dropdownicon.png'/>
                                </Col>
                        </Row>                
                        <Row  className='dropdown-field-menu' id={"dropdown-field-menu-"+props.index} style={{display:"block"}}>
                        <Field field={props.field} index={props.index} fieldtypes={props.fieldtypes} parameters={props.parameters} list={props.list} identifier={identifier} setFieldname={setFieldname}/>
                        </Row>
                    
                </Col>
                <Col xs="1" md="1" lg="1"><Move ref={ref} isDragging={isDragging} handlerId={handlerId} /></Col>
                
                <Col xs="1" md="1" lg="1">
                    <Remove element={props.field.identifier} index={props.index} Remove={props.Remove}/>
                </Col>
            </Row>
        </Form.Group>
    )
}

export default DragNDropComponent;

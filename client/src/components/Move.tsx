import { useDrag } from "react-dnd";


const Move = (props:any) => {

    const [, drag] = useDrag(() => ({
        type:"image",
        item: props.id
    }));

    return (
        <img src=""/>
    )
}

export default Move

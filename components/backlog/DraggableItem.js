import { useEffect, useRef } from 'react';

const DraggableItem = ({ item, onDragStart }) => {
    const dragItem = useRef(null);

    useEffect(() => {
        if (dragItem.current) {
            dragItem.current.addEventListener('dragstart', onDragStart);
        }
    }, []);

    return (
        <div
            ref={dragItem}
            draggable
            className="draggable-item"
        >
            {item}
        </div>
    );
}

export default DraggableItem;
import React, { useRef } from "react";
import { Tr, Td, IconButton } from "@chakra-ui/react";
import { useDrag, useDrop } from "react-dnd";
import { Menu, Trash2 } from "lucide-react";

const DraggableSymptom = ({ symptom, index, moveSymptom }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: "SYMPTOM",
    item: () => ({ id: `${symptom}_${index}`, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop({
    accept: "SYMPTOM",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSymptom(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <Tr
      ref={ref}
      bg={isDragging ? "green.100" : "white"}
      boxShadow={isDragging ? "lg" : "none"}
      transition="all 0.3s"
      _hover={{ bg: "gray.50" }}
      data-handler-id={handlerId}
    >
      <Td>{isDragging ? "" : symptom}</Td>
      <Td width="40px">
        <IconButton
          aria-label="Reorder"
          icon={<Menu />}
          size="sm"
          variant="ghost"
          cursor="move"
          _hover={{ bg: "blue.100" }}
          transition="all 0.2s"
        />
      </Td>
      <Td width="40px">
        <IconButton
          aria-label="Delete"
          icon={<Trash2 />}
          size="sm"
          colorScheme="red"
          variant="ghost"
          _hover={{ bg: "red.100" }}
          transition="all 0.2s"
        />
      </Td>
    </Tr>
  );
};

export default DraggableSymptom;

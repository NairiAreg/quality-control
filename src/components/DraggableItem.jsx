import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Box, Text, HStack, IconButton } from "@chakra-ui/react";
import { Menu, Trash2 } from "lucide-react";

const DraggableItem = ({
  item,
  index,
  type,
  category,
  moveItem,
  onDelete,
  onClick,
  isSelected,
}) => {
  const ref = useRef(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ["CATEGORY", "SYMPTOM"],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      const dragType = draggedItem.type;
      const hoverType = type;
      const dragCategory = draggedItem.category;
      const hoverCategory = category;

      // Don't replace items with themselves
      if (
        dragIndex === hoverIndex &&
        dragType === hoverType &&
        dragCategory === hoverCategory
      ) {
        return;
      }

      // Only handle reordering within the same category here
      if (dragType === hoverType && dragCategory === hoverCategory) {
        // Determine rectangle on screen
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        // Get vertical middle
        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        // Determine mouse position
        const clientOffset = monitor.getClientOffset();
        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
          return;
        }
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
          return;
        }

        moveItem(
          dragIndex,
          hoverIndex,
          draggedItem.item,
          dragType,
          hoverType,
          dragCategory,
          hoverCategory
        );

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        draggedItem.index = hoverIndex;
      }
    },
    drop(draggedItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const dragType = draggedItem.type;
      const dragCategory = draggedItem.category;

      // Handle dropping symptom onto category
      if (dragType === "SYMPTOM" && type === "CATEGORY") {
        moveItem(
          dragIndex,
          0,
          draggedItem.item,
          dragType,
          type,
          dragCategory,
          item
        );
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: type,
    item: () => {
      return { item, index, type, category };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <Box
      ref={ref}
      opacity={isDragging ? 0.5 : 1}
      bg={
        type === "CATEGORY" ? (isSelected ? "blue.100" : "gray.100") : "white"
      }
      p={2}
      borderRadius="md"
      boxShadow="md"
      mb={2}
      data-handler-id={handlerId}
      borderColor={
        handlerId?.isOver && handlerId?.canDrop ? "blue.500" : "transparent"
      }
      borderWidth={2}
      transition="all 0.2s"
      onClick={onClick}
      cursor={type === "CATEGORY" ? "pointer" : "move"}
    >
      <HStack justifyContent="space-between">
        <HStack>
          {type === "SYMPTOM" && <Menu size={16} />}
          <Text>{item}</Text>
        </HStack>
        {type === "SYMPTOM" && (
          <IconButton
            aria-label="Delete symptom"
            icon={<Trash2 size={16} />}
            size="sm"
            colorScheme="red"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
          />
        )}
      </HStack>
    </Box>
  );
};

export default DraggableItem;

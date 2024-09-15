import React, { useState, useCallback, useRef } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  VStack,
  HStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Progress,
  Grid,
  GridItem,
  List,
  ListItem,
  useColorModeValue,
  keyframes,
  Flex,
} from "@chakra-ui/react";
import { Upload, Menu, Trash2, Download } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const QualityControlDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeGeneSubTab, setActiveGeneSubTab] = useState(0);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const geneFiles = [
    { name: "GBA.xlsx", type: "gene" },
    { name: "LRRK2.xlsx", type: "gene" },
    { name: "ALT1.xlsx", type: "gene" },
    { name: "PINK1.xlsx", type: "gene" },
    { name: "SPAST.xlsx", type: "gene" },
  ];

  const categories = [
    "Development in childhood/adolescence",
    "Imaging features",
    "Laboratory results",
    "Motor ictal",
    "Motor interictal",
    "Motor signs and symptoms",
    "Non-motor ictal",
    "Non-motor interictal",
    "Non-motor signs and symptoms",
    "Other ictal",
    "Other interictal",
    "Other signs and symptoms",
    "Paroxysmal movements",
    "Therapy",
    "Triggers",
  ];

  const EditView = () => (
    <Flex gap={6} alignItems="center">
      <Box width="60%" overflowX="auto">
        <Table
          variant="simple"
          bg="white"
          borderRadius="md"
          overflow="hidden"
          size="sm"
        >
          <Thead bg="gray.100">
            <Tr>
              <Th>Gene</Th>
              <Th w="150px">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {geneFiles.map((file) => (
              <Tr key={file.name}>
                <Td>{file.name}</Td>
                <Td w="150px">
                  <Button size="sm" colorScheme="blue">
                    Update
                  </Button>
                  <IconButton
                    aria-label="Delete file"
                    icon={<Trash2 />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <VStack width="40%" spacing={4} align="stretch">
        <Button leftIcon={<Download />} colorScheme="teal" size="md">
          Download Configuration
        </Button>
        <Button leftIcon={<Upload />} colorScheme="purple" size="md">
          Upload Configuration
        </Button>
      </VStack>
    </Flex>
  );

  const ImportView = () => (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading as="h3" size="md" mb={2}>
          Gene Excel file
        </Heading>
        <Button leftIcon={<Upload />} colorScheme="blue">
          Upload
        </Button>
      </Box>

      <Box>
        <Heading as="h3" size="md" mb={4}>
          Update Gene
        </Heading>
        <FormControl>
          <FormLabel>
            Enter the row number to start importing data from:
          </FormLabel>
          <Input placeholder="Enter row number" />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>Adjust step value</FormLabel>
          <Input placeholder="Enter step value" />
        </FormControl>
        <HStack justify="space-between" mt={4}>
          <Button colorScheme="blue">Update</Button>
          <Button variant="outline">Errors</Button>
        </HStack>
        <Box mt={4}>
          <FormLabel>Progress: 0%</FormLabel>
          <Progress value={0} size="sm" colorScheme="blue" />
        </Box>
      </Box>
    </VStack>
  );

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

  const SymptomsView = () => {
    const [symptoms, setSymptoms] = useState([
      "Abnormality of skeletal morphology",
      "Delayed cognitive development",
      "Delayed fine motor development",
      "Delayed gross motor development",
      "Delayed language development",
      "Delayed motor development",
      "Delayed speech and language development",
      "Developmental delay",
      "Developmental delay/intellectual disability",
      "Developmental regression",
      "Dysmorphic features",
      "Global developmental delay",
      "Intellectual developmental disorder",
      "Microcephaly",
      "Mild global developmental delay",
      "Moderate global developmental delay",
    ]);

    const moveSymptom = useCallback((dragIndex, hoverIndex) => {
      setSymptoms((prevSymptoms) => {
        const newSymptoms = [...prevSymptoms];
        const draggedSymptom = newSymptoms[dragIndex];
        newSymptoms.splice(dragIndex, 1);
        newSymptoms.splice(hoverIndex, 0, draggedSymptom);
        return newSymptoms;
      });
    }, []);

    return (
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          <Heading as="h3" size="md" mb={4}>
            Categories
          </Heading>
          <List spacing={2}>
            {categories.map((category, index) => (
              <ListItem
                key={index}
                p={2}
                bg="gray.100"
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: "gray.200", transform: "translateX(5px)" }}
              >
                {category}
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem>
          <Heading as="h3" size="md" mb={4}>
            Symptoms
          </Heading>
          <Box
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            bg="white"
            transition="all 0.3s"
            _hover={{ boxShadow: "lg" }}
          >
            <Table variant="simple">
              <Tbody>
                {symptoms.map((symptom, index) => (
                  <DraggableSymptom
                    key={symptom}
                    symptom={symptom}
                    index={index}
                    moveSymptom={moveSymptom}
                  />
                ))}
              </Tbody>
            </Table>
          </Box>
        </GridItem>
      </Grid>
    );
  };

  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="lg"
      shadow="md"
      animation={`${fadeIn} 0.5s ease-in`}
    >
      <Heading as="h1" size="xl" mb={6} color="red.500">
        Quality Control
      </Heading>

      <Tabs index={activeMainTab} onChange={setActiveMainTab}>
        <TabList>
          <Tab _selected={{ color: "blue.500", borderColor: "blue.500" }}>
            Genes
          </Tab>
          <Tab _selected={{ color: "blue.500", borderColor: "blue.500" }}>
            Symptoms
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Tabs index={activeGeneSubTab} onChange={setActiveGeneSubTab}>
              <TabList mb={4}>
                <Tab
                  _selected={{ color: "green.500", borderColor: "green.500" }}
                >
                  Edit
                </Tab>
                <Tab
                  _selected={{ color: "green.500", borderColor: "green.500" }}
                >
                  Import
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <EditView />
                </TabPanel>
                <TabPanel>
                  <ImportView />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </TabPanel>

          <TabPanel>
            <DndProvider backend={HTML5Backend}>
              <SymptomsView />
            </DndProvider>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default QualityControlDashboard;

// ###
// POST http://localhost:8082/IN/EX

// ###
// GET http://localhost:8082/api/genes

// ###
// GET http://localhost:8082/api/getStep

// ###
// GET http://localhost:8082/api/ps

// ###
// POST http://localhost:8082/clearLogFile

// ###
// GET http://localhost:8082/download

// ###
// GET http://localhost:8082/downloadLog

// ###
// POST http://localhost:8082/excel/upload

// ###
// POST http://localhost:8082/files

// ###
// POST http://localhost:8082/generate/excel

// ###
// POST http://localhost:8082/generate/excel/pubmedId

// ###
// GET http://localhost:8082/last100Lines

// ###
// GET http://localhost:8082/logFile

// ###
// GET http://localhost:8082/progressOfImport

// ###
// GET http://localhost:8082/startingRow

// ###
// POST http://localhost:8082/upload

// ###
// GET http://localhost:8082/upload/properties

// ###
// PUT http://localhost:8082/api/setStep
// Content-Type: application/json

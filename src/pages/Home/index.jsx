import React, { useState, useCallback } from "react";
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
} from "@chakra-ui/react";
import { DeleteIcon, Upload, Menu, Trash2 } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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

  const moveSymptom = useCallback(
    (dragIndex, hoverIndex) => {
      const dragSymptom = symptoms[dragIndex];
      setSymptoms((prevSymptoms) => {
        const newSymptoms = [...prevSymptoms];
        newSymptoms.splice(dragIndex, 1);
        newSymptoms.splice(hoverIndex, 0, dragSymptom);
        return newSymptoms;
      });
    },
    [symptoms]
  );

  const EditView = () => (
    <VStack align="stretch" spacing={4}>
      <Box overflowX="auto">
        <Table variant="simple" bg="white" borderRadius="md" overflow="hidden">
          <Thead bg="gray.100">
            <Tr>
              <Th>Gene</Th>
              <Th>Edit</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {geneFiles.map((file) => (
              <Tr key={file.name}>
                <Td>{file.name}</Td>
                <Td>
                  <Button size="sm" colorScheme="blue">
                    Update
                  </Button>
                </Td>
                <Td>
                  <IconButton
                    aria-label="Delete file"
                    icon={<DeleteIcon />}
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
    </VStack>
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
    const [, drag] = useDrag({
      type: "SYMPTOM",
      item: { index },
    });

    const [, drop] = useDrop({
      accept: "SYMPTOM",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveSymptom(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    return (
      <Tr ref={(node) => drag(drop(node))}>
        <Td>{symptom}</Td>
        <Td width="40px">
          <IconButton
            aria-label="Reorder"
            icon={<Menu />}
            size="sm"
            variant="ghost"
            cursor="move"
          />
        </Td>
        <Td width="40px">
          <IconButton
            aria-label="Delete"
            icon={<Trash2 />}
            size="sm"
            colorScheme="red"
            variant="ghost"
          />
        </Td>
      </Tr>
    );
  };

  const SymptomsView = () => (
    <Grid templateColumns="1fr 2fr" gap={6}>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Categories
        </Heading>
        <List spacing={2}>
          {categories.map((category, index) => (
            <ListItem key={index} p={2} bg="gray.100" borderRadius="md">
              {category}
            </ListItem>
          ))}
        </List>
      </GridItem>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Symptoms
        </Heading>
        <Table variant="simple">
          <Tbody>
            {symptoms.map((symptom, index) => (
              <DraggableSymptom
                key={`${symptom}_${index}`}
                symptom={symptom}
                index={index}
                moveSymptom={moveSymptom}
              />
            ))}
          </Tbody>
        </Table>
      </GridItem>
    </Grid>
  );

  return (
    <Box p={5} bg={bgColor} borderRadius="lg" shadow="md">
      <Heading as="h1" size="xl" mb={6} color="red.500">
        Quality Control
      </Heading>

      <Tabs index={activeMainTab} onChange={setActiveMainTab}>
        <TabList>
          <Tab>Genes</Tab>
          <Tab>Symptoms</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0}>
            <Tabs index={activeGeneSubTab} onChange={setActiveGeneSubTab}>
              <TabList mb={4}>
                <Tab>Edit</Tab>
                <Tab>Import</Tab>
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

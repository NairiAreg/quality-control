import React, { useState, useCallback } from "react";
import {
  Box,
  Table,
  Tbody,
  Heading,
  Grid,
  GridItem,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { genesQuery } from "api/api-service.js";
import DraggableSymptom from "./DraggableSymptom";

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
  const {
    data: genes,
    isLoading: genesLoading,
    error: genesError,
  } = useQuery(genesQuery);

  return (
    <Grid templateColumns="1fr 2fr" gap={6}>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Genes
        </Heading>
        {genesLoading ? (
          <Spinner />
        ) : genesError ? (
          <Text color="red.500">Error loading genes: {genesError.message}</Text>
        ) : (
          <List spacing={2}>
            {genes.map((gene, index) => (
              <ListItem
                key={index}
                p={2}
                bg="gray.100"
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: "gray.200", transform: "translateX(5px)" }}
              >
                {gene}
              </ListItem>
            ))}
          </List>
        )}
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

export default SymptomsView;

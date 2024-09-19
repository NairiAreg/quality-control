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
  Select,
  Input,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery, genesQuery, symptomsQuery } from "api/api-service.js";
import DraggableSymptom from "./DraggableSymptom";

const SymptomsView = () => {
  const [selectedGene, setSelectedGene] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery(categoriesQuery());
  const {
    data: genes,
    isLoading: genesLoading,
    error: genesError,
  } = useQuery(genesQuery());
  const {
    data: symptoms,
    isLoading: symptomsLoading,
    error: symptomsError,
  } = useQuery({
    ...symptomsQuery(selectedGene),
    enabled: !!selectedGene,
  });
  const setSymptoms = () => {
    //TODO
  };
  const moveSymptom = useCallback((dragIndex, hoverIndex) => {
    setSymptoms((prevSymptoms) => {
      const newSymptoms = [...prevSymptoms];
      const draggedSymptom = newSymptoms[dragIndex];
      newSymptoms.splice(dragIndex, 1);
      newSymptoms.splice(hoverIndex, 0, draggedSymptom);
      return newSymptoms;
    });
  }, []);
  const filteredGenes =
    genes?.filter((gene) =>
      gene.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Grid templateColumns="1fr 1fr 2fr" gap={6}>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Categories
        </Heading>
        {categoriesLoading ? (
          <Spinner />
        ) : categoriesError ? (
          <Text color="red.500">
            Error loading categories: {categoriesError.message}
          </Text>
        ) : (
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
        )}
      </GridItem>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Genes
        </Heading>
        <Box mb={4}>
          <Input
            placeholder="Search genes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb={2}
          />
          <Select
            placeholder="Select a gene"
            value={selectedGene}
            onChange={(e) => setSelectedGene(e.target.value)}
          >
            {filteredGenes.map((gene) => (
              <option key={gene} value={gene}>
                {gene}
              </option>
            ))}
          </Select>
        </Box>
      </GridItem>
      <GridItem>
        <Heading as="h3" size="md" mb={4}>
          Symptoms
        </Heading>
        {symptomsLoading ? (
          <Spinner />
        ) : symptomsError ? (
          <Text color="red.500">
            Error loading symptoms: {symptomsError.message}
          </Text>
        ) : symptoms ? (
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
        ) : (
          <Text>Select a gene to view symptoms</Text>
        )}
      </GridItem>
    </Grid>
  );
};

export default SymptomsView;

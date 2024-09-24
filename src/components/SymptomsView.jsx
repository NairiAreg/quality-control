import React, { useState, useCallback, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  genesQuery,
  symptomsQuery,
  deleteSymptom,
  updateSymptomCategory,
} from "api/api-service.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "./DraggableItem";
import CustomDropdown from "./CustomDropdown";

const SymptomsView = () => {
  const [selectedGene, setSelectedGene] = useState("");
  const [symptomsData, setSymptomsData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: genes, isLoading: genesLoading } = useQuery(genesQuery());
  const {
    data: initialSymptomsData,
    isLoading: symptomsLoading,
    error: symptomsError,
  } = useQuery({
    ...symptomsQuery(selectedGene),
    enabled: !!selectedGene,
  });

  useEffect(() => {
    if (initialSymptomsData) {
      setSymptomsData(initialSymptomsData);
      setSelectedCategory(Object.keys(initialSymptomsData)[0] || "");
    }
  }, [initialSymptomsData]);

  const deleteSymptomMutation = useMutation({
    mutationFn: deleteSymptom,
    onSuccess: () => {
      queryClient.invalidateQueries(["symptoms", selectedGene]);
      toast({
        title: "Symptom deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting symptom",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const updateSymptomCategoryMutation = useMutation({
    mutationFn: updateSymptomCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["symptoms", selectedGene]);
      toast({
        title: "Symptom category updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating symptom category",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const moveItem = useCallback(
    (
      dragIndex,
      hoverIndex,
      draggedItem,
      dragType,
      hoverType,
      dragCategory,
      hoverCategory
    ) => {
      setSymptomsData((prevData) => {
        const newData = { ...prevData };
        if (dragType === "SYMPTOM") {
          if (hoverType === "SYMPTOM" && dragCategory === hoverCategory) {
            // Reorder within the same category
            const newSymptoms = [...newData[dragCategory]];
            newSymptoms.splice(dragIndex, 1);
            newSymptoms.splice(hoverIndex, 0, draggedItem);
            newData[dragCategory] = newSymptoms;
          } else if (
            hoverType === "CATEGORY" &&
            dragCategory !== hoverCategory
          ) {
            // Move to a different category
            newData[dragCategory] = newData[dragCategory].filter(
              (s) => s !== draggedItem
            );
            if (!newData[hoverCategory]) {
              newData[hoverCategory] = [];
            }
            newData[hoverCategory].push(draggedItem);
            // Call the mutation to update the backend (commented out for now)
            // updateSymptomCategoryMutation.mutate({
            //   symptom: draggedItem,
            //   newCategory: hoverCategory,
            // });
          }
        }
        return newData;
      });
    },
    [updateSymptomCategoryMutation]
  );

  const handleDeleteSymptom = useCallback(
    (symptom) => {
      deleteSymptomMutation.mutate(symptom);
      setSymptomsData((prevData) => {
        const newData = { ...prevData };
        Object.keys(newData).forEach((category) => {
          newData[category] = newData[category].filter((s) => s !== symptom);
        });
        return newData;
      });
    },
    [deleteSymptomMutation]
  );

  const categories = symptomsData ? Object.keys(symptomsData) : [];

  return (
    <DndProvider backend={HTML5Backend}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h3" size="md" mb={4}>
            Select Gene
          </Heading>
          <CustomDropdown
            options={genes || []}
            value={selectedGene}
            onChange={(gene) => {
              setSelectedGene(gene);
              setSymptomsData({});
              setSelectedCategory("");
            }}
            placeholder="Select a gene"
          />
        </Box>

        {selectedGene && (
          <HStack spacing={6} align="flex-start">
            <Box flex={1}>
              <Heading as="h3" size="md" mb={4}>
                Categories
              </Heading>
              {symptomsLoading ? (
                <Spinner />
              ) : symptomsError ? (
                <Text color="red.500">
                  Error loading categories: {symptomsError.message}
                </Text>
              ) : (
                <VStack align="stretch" spacing={2}>
                  {categories.map((category, index) => (
                    <DraggableItem
                      key={`${category}_${index}`}
                      item={category}
                      index={index}
                      type="CATEGORY"
                      moveItem={moveItem}
                      onClick={() => setSelectedCategory(category)}
                      isSelected={category === selectedCategory}
                    />
                  ))}
                </VStack>
              )}
            </Box>
            <Box flex={1}>
              <Heading as="h3" size="md" mb={4}>
                Symptoms
              </Heading>
              {symptomsLoading ? (
                <Spinner />
              ) : symptomsError ? (
                <Text color="red.500">
                  Error loading symptoms: {symptomsError.message}
                </Text>
              ) : selectedCategory ? (
                <VStack align="stretch" spacing={2}>
                  {symptomsData[selectedCategory]?.map((symptom, index) => (
                    <DraggableItem
                      key={`${selectedCategory}-${symptom}`}
                      item={symptom}
                      index={index}
                      type="SYMPTOM"
                      category={selectedCategory}
                      moveItem={moveItem}
                      onDelete={() => handleDeleteSymptom(symptom)}
                    />
                  ))}
                </VStack>
              ) : (
                <Text>Select a category to view symptoms</Text>
              )}
            </Box>
          </HStack>
        )}
      </VStack>
    </DndProvider>
  );
};

export default SymptomsView;

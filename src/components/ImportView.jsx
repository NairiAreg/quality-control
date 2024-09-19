import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  List,
  ListItem,
  useToast,
  Text,
} from "@chakra-ui/react";
import { Upload } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadGeneExcelFile, getErrors } from "api/api-service.js";

const ImportView = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: errors,
    isLoading: errorsLoading,
    refetch: refetchErrors,
  } = useQuery({
    queryKey: ["errors"],
    queryFn: getErrors,
    enabled: false,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadGeneExcelFile,
    onSuccess: () => {
      toast({
        title: "File uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setUploadProgress(100);
      queryClient.invalidateQueries(["files"]);
    },
    onError: (error) => {
      toast({
        title: "Error uploading file",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setUploadProgress(0);
    },
  });

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile);
    }
  };

  const handleViewErrors = () => {
    refetchErrors();
    onOpen();
  };

  return (
    <VStack align="stretch" spacing={6}>
      <Box>
        <Heading as="h3" size="md" mb={2}>
          Gene Excel file
        </Heading>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="file-upload"
        />
        <label htmlFor="file-upload">
          <Button as="span" leftIcon={<Upload />} colorScheme="blue">
            Select File
          </Button>
        </label>
        {selectedFile && <Text mt={2}>{selectedFile.name}</Text>}
        <Button
          mt={2}
          colorScheme="green"
          onClick={handleUpload}
          isLoading={uploadMutation.isPending}
        >
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
          <Button variant="outline" onClick={handleViewErrors}>
            Errors
          </Button>
        </HStack>
        <Box mt={4}>
          <FormLabel>Progress: {uploadProgress}%</FormLabel>
          <Progress value={uploadProgress} size="sm" colorScheme="blue" />
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Errors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {errorsLoading ? (
              <Text>Loading errors...</Text>
            ) : errors && errors.length > 0 ? (
              <List spacing={2}>
                {errors.map((error, index) => (
                  <ListItem key={index}>{error}</ListItem>
                ))}
              </List>
            ) : (
              <Text>No errors found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ImportView;

import React from "react";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  VStack,
  Flex,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, Trash2, Download } from "lucide-react";
import {
  filesQuery,
  deleteExcelFile,
  downloadConfiguration,
  uploadConfiguration,
} from "api/api-service.js";

const EditView = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = useQuery(filesQuery());

  const deleteFileMutation = useMutation({
    mutationFn: deleteExcelFile,
    onSuccess: () => {
      queryClient.invalidateQueries("files");
      toast({
        title: "File deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting file",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleDeleteFile = (fileId) => {
    deleteFileMutation.mutate(fileId);
  };

  const handleDownloadConfiguration = async () => {
    try {
      await downloadConfiguration();
    } catch (error) {
      toast({
        title: "Error downloading configuration",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const uploadConfigurationMutation = useMutation({
    mutationFn: uploadConfiguration,
    onSuccess: () => {
      queryClient.invalidateQueries("files");
      toast({
        title: "Configuration uploaded successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: (error) => {
      toast({
        title: "Error uploading configuration",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const handleUploadConfiguration = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadConfigurationMutation.mutate(file);
    }
  };

  return (
    <Flex gap={6} alignItems="flex-start">
      <Box width="60%" overflowX="auto">
        {filesLoading ? (
          <Spinner />
        ) : filesError ? (
          <Text color="red.500">Error loading files: {filesError.message}</Text>
        ) : (
          <Table
            variant="simple"
            bg="white"
            borderRadius="md"
            overflow="hidden"
            size="sm"
          >
            <Thead bg="gray.100">
              <Tr>
                <Th>Gene Excel File</Th>
                <Th w="100px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.map((file) => (
                <Tr key={file}>
                  <Td>{file}</Td>
                  <Td w="100px">
                    <IconButton
                      aria-label="Delete file"
                      icon={<Trash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDeleteFile(file)}
                      isLoading={deleteFileMutation.isLoading}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <VStack width="40%" spacing={4} align="stretch">
        <Button
          leftIcon={<Download />}
          colorScheme="teal"
          size="md"
          onClick={handleDownloadConfiguration}
        >
          Download Configuration
        </Button>
        <Button leftIcon={<Upload />} colorScheme="purple" size="md" as="label">
          Upload Configuration
          <input
            type="file"
            hidden
            accept=".zip"
            onChange={handleUploadConfiguration}
          />
        </Button>
      </VStack>
    </Flex>
  );
};

export default EditView;

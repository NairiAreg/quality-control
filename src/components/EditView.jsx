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
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Upload, Trash2, Download } from "lucide-react";
import { filesQuery } from "api/api-service.js";

const EditView = () => {
  const {
    data: files,
    isLoading: filesLoading,
    error: filesError,
  } = useQuery(filesQuery);
  return (
    <Flex gap={6} alignItems="center">
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
                <Th>Gene</Th>
                <Th w="150px">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {files.map((file) => (
                <Tr key={file}>
                  <Td>{file}</Td>
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
        )}
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
};

export default EditView;

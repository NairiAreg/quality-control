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
} from "@chakra-ui/react";
import { Upload } from "lucide-react";

const ImportView = () => {
  return (
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
};

export default ImportView;

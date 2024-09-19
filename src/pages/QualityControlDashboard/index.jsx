import React, { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  useColorModeValue,
  keyframes,
} from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import EditView from "components/EditView";
import ImportView from "components/ImportView";
import SymptomsView from "components/SymptomsView";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const QualityControlDashboard = () => {
  const [activeMainTab, setActiveMainTab] = useState(0);
  const [activeGeneSubTab, setActiveGeneSubTab] = useState(0);
  const bgColor = useColorModeValue("gray.50", "gray.700");

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

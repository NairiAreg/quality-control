import axios from "axios";

const BASE_URL = "http://localhost:8082/api";

export const filesQuery = {
  queryKey: ["files"],
  queryFn: async () => {
    const response = await axios.get(`${BASE_URL}/gene/list_excel_files`);
    return response.data;
  },
};

export const genesQuery = {
  queryKey: ["genes"],
  queryFn: async () => {
    const response = await axios.get(`${BASE_URL}/gene/list_genes`);
    return response.data;
  },
};

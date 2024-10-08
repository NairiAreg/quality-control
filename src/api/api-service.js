import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const filesQuery = () => ({
  queryKey: ["files"],
  queryFn: async () => {
    const response = await axios.get(`${BASE_URL}/gene/list_excel_files`);
    return response.data;
  },
});

export const genesQuery = () => ({
  queryKey: ["genes"],
  queryFn: async () => {
    const response = await axios.get(`${BASE_URL}/gene/list_genes`);
    return response.data;
  },
});

export const categoriesQuery = () => ({
  queryKey: ["categories"],
  queryFn: async () => {
    const response = await axios.get(`${BASE_URL}/gene/list_categories`);
    return response.data;
  },
});

export const updateSymptomCategory = async (updatedSymptoms) => {
  const response = await axios.post(
    `${BASE_URL}/gene/set_symptom_order`,
    updatedSymptoms
  );
  return response.data;
};

export const symptomsQuery = (geneId) => ({
  queryKey: ["symptoms", geneId],
  queryFn: async () => {
    const response = await axios.get(
      `${BASE_URL}/gene/list_symptoms?gene_id=${geneId}`
    );
    return response.data;
  },
});

export const deleteExcelFile = async (fileId) => {
  await axios.delete(`${BASE_URL}/gene/delete_excel_file?fileId=${fileId}`);
};

export const deleteSymptom = async (symptomId) => {
  await axios.delete(`${BASE_URL}/gene/delete_symptom?symptomId=${symptomId}`);
};

export const uploadGeneExcelFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return await axios.post(`${BASE_URL}/gene/add_new_gene`, formData);
};

export const updateExcelFile = async (fileId, newFile) => {
  const formData = new FormData();
  formData.append("file", newFile);
  return await axios.post(
    `${BASE_URL}/gene/update_excel_file?fileId=${fileId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getErrors = async () => {
  const response = await axios.get(`${BASE_URL}/gene/get_errors`);
  return response.data;
};

export const uploadConfiguration = async (zipFile) => {
  const formData = new FormData();
  formData.append("zip", zipFile);
  await axios.post(`${BASE_URL}/gene/upload_configuration`, formData);
};

export const downloadConfiguration = async () => {
  const response = await axios.get(`${BASE_URL}/gene/download_configuration`, {
    responseType: "blob",
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "configuration.zip");
  document.body.appendChild(link);
  link.click();
  link.remove();
};

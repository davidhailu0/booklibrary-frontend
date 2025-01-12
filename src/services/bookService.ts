import apiClient from "@/config/axiosConfig";

export const fetchBooks = async () => {
  const response = await apiClient.get("/books/");
  return response.data;
};

export const searchBook = async (query: string) => {
  const response = await apiClient.get("/books/search", {
    params: {
      query,
    },
  });
  return response.data;
};

export const searchBookAPI = async (params: {
  title?: string;
  author?: string;
  isbn?: string;
}) => {
  const response = await apiClient.get("", {
    baseURL: process.env.NEXT_PUBLIC_OPENLIBRARY_API_SEARCH_URL,
    params,
  });
  return response.data;
};

export const addBook = async (book: any) => {
  const response = await apiClient.post("/books/", book);
  return response.data;
};

export const editBook = async (book: any) => {
  const response = await apiClient.put(`/books/${book.id}/`, book);
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await apiClient.delete(`/books/${id}/`);
  return response.data;
};

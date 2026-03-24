import axiosClient from "../config/axios";
import type {
  Category,
  ListCategoriesResponse,
} from "../interfaces/dto/categories";

export default function CategoriesRequest() {
  const list = async (): Promise<Category[]> => {
    const response =
      await axiosClient.get<ListCategoriesResponse>("categories");

    return Array.isArray(response.data?.categories)
      ? response.data.categories
      : [];
  };

  return {
    list,
  };
}

import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import {
  BookingType,
  HotelSearchResponse,
  HotelType,
  PaymentIntentResponse,
  UserType,
} from "./types/types";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


export const fetchCurrentUser = async (): Promise<UserType> => {
  const { data } = await apiClient.get("/api/users/me");
  return data;
};

export const register = async (formData: RegisterFormData) => {
  const { data } = await apiClient.post("/api/users/register", formData);
  return data;
};

export const signIn = async (formData: SignInFormData) => {
  const { data } = await apiClient.post("/api/users/login", formData);
  return data;
};

export const validateToken = async () => {
  const { data } = await apiClient.get("/api/auth/validate-token");
  return data;
};

export const signOut = async () => {
  await apiClient.post("/api/auth/logout");
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const { data } = await apiClient.post("/api/my-hotels", hotelFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
  const { data } = await apiClient.get("/api/my-hotels");
  return data;
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
  const { data } = await apiClient.get(`/api/my-hotels/${hotelId}`);
  return data;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
  const { data } = await apiClient.put(
    `/api/my-hotels/${hotelFormData.get("hotelId")}`,
    hotelFormData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export type SearchParamas = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adultCount?: string;
  childCount?: string;
  page?: string;
  facilities?: string[];
  types?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export const searchHotels = async (
  searchParams: SearchParamas
): Promise<HotelSearchResponse> => {
  const params = new URLSearchParams();

  params.append("destination", searchParams.destination || "");
  params.append("checkIn", searchParams.checkIn || "");
  params.append("checkOut", searchParams.checkOut || "");
  params.append("adultCount", searchParams.adultCount || "");
  params.append("childCount", searchParams.childCount || "");
  params.append("page", searchParams.page || "");
  params.append("maxPrice", searchParams.maxPrice || "");
  params.append("sortOption", searchParams.sortOption || "");

  searchParams.facilities?.forEach((f) => params.append("facilities", f));
  searchParams.types?.forEach((t) => params.append("types", t));
  searchParams.stars?.forEach((s) => params.append("stars", s));

  const { data } = await apiClient.get(`/api/hotels/search?${params.toString()}`);
  return data;
};

export const fetchHotels = async (): Promise<HotelType[]> => {
  const { data } = await apiClient.get("/api/hotels");
  return data;
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
  const { data } = await apiClient.get(`/api/hotels/${hotelId}`);
  return data;
};

export const createPaymentIntent = async (
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponse> => {
  const { data } = await apiClient.post(
    `/api/hotels/${hotelId}/bookings/payment-intent`,
    { numberOfNights }
  );
  return data;
};

export const createRoomBooking = async (formData: BookingFormData) => {
  const { data } = await apiClient.post(
    `/api/hotels/${formData.hotelId}/bookings`,
    formData
  );
  return data;
};

export const fetchMyBookings = async (): Promise<BookingType[]> => {
  const { data } = await apiClient.get("/api/my-bookings");
  return data;
};

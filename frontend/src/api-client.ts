import axios from "axios";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await apiClient.get("/api/users/me");
    return response.data;
};

export const register = async (formData: RegisterFormData) => {
    const response = await apiClient.post("/api/users/register", formData);
    return response.data;
};

export const signIn = async (formData: SignInFormData) => {
    const response = await apiClient.post("/api/users/login", formData);
    return response.data;
};

export const validateToken = async () => {
    const response = await apiClient.get("/api/auth/validate-token");
    return response.data;
};

export const singOut = async () => {
    const response = await apiClient.post("/api/auth/logout");
    return response.data;
};

export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await apiClient.post("/api/my-hotels", hotelFormData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const fetchMyHotels = async (): Promise<HotelType[]> => {
    const response = await apiClient.get("/api/my-hotels");
    return response.data;
};

export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await apiClient.get(`/api/my-hotels/${hotelId}`);
    return response.data;
};

export const updateMyHotelById = async (hotelFormData: FormData) => {
    const hotelId = hotelFormData.get("hotelId");
    const response = await apiClient.put(`/api/my-hotels/${hotelId}`, hotelFormData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
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
    const response = await apiClient.get("/api/hotels/search", {
        params: searchParams,
        paramsSerializer: { indexes: null }, // This handles array parameters correctly
    });
    return response.data;
};

export const fetchHotels = async (): Promise<HotelType[]> => {
    const response = await apiClient.get("/api/hotels");
    return response.data;
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await apiClient.get(`/api/hotels/${hotelId}`);
    return response.data;
};

export const createPaymentIntent = async (
    hotelId: string,
    numberOfNights: string
): Promise<PaymentIntentResponse> => {
    const response = await apiClient.post(
        `/api/hotels/${hotelId}/bookings/payment-intent`,
        { numberOfNights }
    );
    return response.data;
};

export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await apiClient.post(
        `/api/hotels/${formData.hotelId}/bookings`,
        formData
    );
    return response.data;
};

export const fetchMyBookings = async (): Promise<BookingType[]> => {
    const response = await apiClient.get("/api/my-bookings");
    return response.data;
};

// Add error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || "An error occurred";
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
);
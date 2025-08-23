import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchMyHotelById, updateMyHotelById } from "../api-client";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";

const EditHotel = () => {
    const { hotelId } = useParams();

    const { data: hotel } = useQuery(
        "fetchMyHotelById",
        () => fetchMyHotelById(hotelId || ""),
        {
            enabled: !!hotelId,
        }
    );

    const { showToast } = useAppContext();
    const { mutate, isLoading } = useMutation(updateMyHotelById, {
        onSuccess: () => {
            showToast({ message: "Hotel Edited successfully", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Saving Hotel Failed", type: "ERROR" });
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData);
    };

    return (
        <ManageHotelForm
            hotel={hotel}
            onSave={handleSave}
            isLoading={isLoading}
        />
    );
};

export default EditHotel;

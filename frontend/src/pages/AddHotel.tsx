import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { addMyHotel } from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const AddHotel = () => {
    const { showToast } = useAppContext();
    const { mutate, isLoading } = useMutation(addMyHotel, {
        onSuccess: () => {
            showToast({ message: "Hotel added successfully", type: "SUCCESS" });
        },
        onError: () => {
            showToast({ message: "Saving Hotel Failed", type: "ERROR" });
        },
    });
    const handleSave = (hotelFormDate: FormData) => {
        mutate(hotelFormDate);
    };

    return <ManageHotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;

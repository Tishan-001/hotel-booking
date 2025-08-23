import { useMutation, useQueryClient } from "react-query";
import { singOut } from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    const { showToast } = useAppContext();
    const QueryClient = useQueryClient();
    const mutation = useMutation(singOut, {
        onSuccess: async () => {
            await QueryClient.invalidateQueries("validateToken");
            showToast({ message: "Signed Out!", type: "SUCCESS" });
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });
    const handleClick = () => {
        mutation.mutate();
    };

    return (
        <button
            onClick={handleClick}
            type="button"
            className="text-blue-600 px-3 font-bold bg-white hover:bg-gray-100"
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;

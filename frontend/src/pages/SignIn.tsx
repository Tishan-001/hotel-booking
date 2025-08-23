import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { signIn } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
};

const SignIn = () => {
    const { showToast } = useAppContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation()

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignInFormData>();

    const mutation = useMutation(signIn, {
        onSuccess: async () => {
            showToast({ message: "Sign In Successful!", type: "SUCCESS" });
            await queryClient.invalidateQueries("validateToken");
            navigate(location.state?.from?.pathname || "/");
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: "ERROR" });
        },
    });
    const onSubmit = handleSubmit((data) => {
        mutation.mutate(data);
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>
            <label
                className="text-gray-700 text-sm font-bold flex-1"
                htmlFor="last-name-input"
            >
                Email
                <input
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {
                        required: "The Email Is Required",
                    })}
                />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label
                className="text-gray-700 text-sm font-bold flex-1"
                htmlFor="last-name-input"
            >
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "The Password Is Required",
                        minLength: {
                            value: 6,
                            message: "Password Must Be At Least 6 Characters",
                        },
                    })}
                />
                {errors.password && (
                    <span className="text-red-500">
                        {errors.password.message}
                    </span>
                )}
            </label>
            <span className="flex items-center justify-between">
                <span className="text-sm">
                    Note Registered?{" "}
                    <Link className="underline" to="/register">
                        Create An Account Here
                    </Link>
                </span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl"
                >
                    Login
                </button>
            </span>
        </form>
    );
};

export default SignIn;

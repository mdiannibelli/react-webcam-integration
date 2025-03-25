import { Bounce, toast, ToastOptions } from 'react-toastify';

type NotificationType = "success" | "error" | "warning" | "info"

export const makeNotification = (message: string, type: NotificationType = "success") => {
    const options: ToastOptions = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
    };

    toast[type](message, options);
}

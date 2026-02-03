import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";

const TOAST_OPTIONS = {
  position: "top-center",
  className: "campfire-toast",
};

export const handleSuccess = (msg) => {
  toast.dismiss();
  toast.success(msg, {
    ...TOAST_OPTIONS,
    className: "campfire-toast success",
  });
};

export const handleError = (msg) => {
  toast.dismiss();
  toast.error(msg, {
    ...TOAST_OPTIONS,
    className: "campfire-toast error",
  });
};

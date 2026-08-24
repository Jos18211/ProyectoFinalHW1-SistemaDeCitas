import { CircleAlert } from "lucide-react";
import PropTypes from "prop-types";

export function FormError({ message }) {
    if (!message) return null;

    return (
        <p className="mt-1 text-sm font-medium text-destructive">
            <CircleAlert /> {message}
        </p>
    );
}

FormError.propTypes = {
    message: PropTypes.string
}

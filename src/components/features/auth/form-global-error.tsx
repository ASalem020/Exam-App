import { XCircle } from "lucide-react";
import { FieldErrors } from "react-hook-form";

interface FormGlobalErrorProps {
    errors: FieldErrors<any>;
}

export default function FormGlobalError({ errors }: FormGlobalErrorProps) {
    if (!errors.root?.serverError) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 relative">
            <XCircle className="text-red-600 absolute bg-red-50  rounded-full top-0 left-1/2 -translate-y-1/2 " />
            <p className="text-red-600 text-center text-sm">
                {errors.root.serverError.message as string}
            </p>
        </div>
    );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface FileInputProps extends React.HTMLProps<HTMLInputElement> {
    label?: string;
    multiple?: boolean;
}

const FileInput: React.FC<FileInputProps> = ({ label, multiple, ...props }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFiles(Array.from(event.target.files));
        }
    };

    return (
        <div>
            {label && (
                <label htmlFor={props.id} className="block font-medium">
                    {label}
                </label>
            )}
            <div className="flex items-center space-x-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        (document.getElementById(props.id!) as HTMLInputElement)?.click();
                    }}
                >
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : "Choose File(s)"}
                </Button>
                <input type="file" id={props.id} className="hidden" multiple={multiple} onChange={handleFileChange} {...props} />
            </div>
            {selectedFiles.length > 0 && (
                <div className="mt-2">
                    {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <span>{file.name}</span>
                            <button
                                type="button"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileInput;

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <div className="relative w-full h-[600px]">
                    <Image
                        src={imageUrl}
                        alt="Payment Proof"
                        fill
                        className="object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-car.png";
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ImageModal;

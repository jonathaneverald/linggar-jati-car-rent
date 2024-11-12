const Footer = () => {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Linggar Jati Rent Car</h3>
                        <p className="text-gray-600 text-sm">Address: 1234 Fashion Street, Suite 567</p>
                        <p className="text-gray-600 text-sm">demo@demo.com</p>
                        <p className="text-gray-600 text-sm">+12929012122</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Cars</li>
                            <li>Drivers</li>
                            <li>Deals</li>
                            <li>Coupon</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
                        <ul className="space-y-2 text-sm">
                            <li>FAQ & Helps</li>
                            <li>Vendor Refund Policies</li>
                            <li>Customer Refund Policies</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Our Information</h3>
                        <ul className="space-y-2 text-sm">
                            <li>Manufacturers</li>
                            <li>Privacy policies</li>
                            <li>Terms & conditions</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">©2024 Linggar Jati. Copyright © REDQ. All rights reserved worldwide. REDQ</div>
            </div>
        </footer>
    );
};

export default Footer;

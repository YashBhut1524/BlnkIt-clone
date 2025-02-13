import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn  } from "react-icons/fa";
import { BsThreads } from "react-icons/bs";

function Footer() {
    return (
        <footer className="border-t">
            <div className="container mx-auto p-4 text-center flex flex-col lg:flex-row gap-2 items-center lg:justify-between">
                <p>© All Rights Reserved 2025.</p>
                <div className="flex item-center justify-center gap-4">
                    <a href="#" className="p-2 bg-black rounded-full text-white">
                        <FaFacebookF size={20} />
                    </a>
                    <a href="#" className="p-2 bg-black rounded-full text-white">
                        <FaTwitter size={20} />
                    </a>
                    <a href="#" className="p-2 bg-black rounded-full text-white">
                        <FaInstagram size={20} />
                    </a>
                    <a href="#" className="p-2 bg-black rounded-full text-white">
                        <FaLinkedinIn size={20} />
                    </a>
                    <a href="#" className="p-2 bg-black rounded-full text-white">
                        <BsThreads size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

import Image from "next/image";
import Link from "next/link";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white py-6 border-t border-gray-200">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Left Section: Logo and Address */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start mb-4">
            <Image
              src="/mobile-logo.png"
              width={50}
              height={50}
              alt="Petopia Logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold ml-2">Petopia</span>
          </div>
          <p className="text-gray-600">
            848 King Street, Mesa, AZ 85201, Boston, USA
          </p>
          <p className="text-gray-600">info@pawsitively.com</p>
          <p className="text-gray-600 mt-2">
            &copy; 2022 Brand, Inc. &bull; <Link href="#">Privacy</Link> &bull;{" "}
            <Link href="#">Terms</Link> &bull; <Link href="#">Sitemap</Link>
          </p>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="text-center">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
            <li>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Services
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                About us
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Location & hours
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
            </li>
            <li>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Social Media Links */}
        <div className="flex space-x-4">
          <Link href="#">
            <FaTwitter className="text-gray-600 hover:text-gray-900" />
          </Link>
          <Link href="#">
            <FaFacebookF className="text-gray-600 hover:text-gray-900" />
          </Link>
          <Link href="#">
            <FaLinkedinIn className="text-gray-600 hover:text-gray-900" />
          </Link>
          <Link href="#">
            <FaYoutube className="text-gray-600 hover:text-gray-900" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

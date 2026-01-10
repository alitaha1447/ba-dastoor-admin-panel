import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-3 md:mb-0">
                    <p className="text-sm text-gray-600">
                        © {currentYear} Ba-Dastoor Admin Portal. All rights reserved.
                    </p>
                </div>

                {/* <div className="flex items-center gap-6">
                    <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="#"
                        className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        Support
                    </a>
                </div> */}
            </div>

            {/* <div className="mt-3 text-center md:text-left">
                <p className="text-xs text-gray-500">
                    Version 1.0.0 • Last updated: March 2024
                </p>
            </div> */}
        </footer>
    )
}

export default Footer
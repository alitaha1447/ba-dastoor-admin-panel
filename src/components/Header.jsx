import React from 'react'
import { Menu, Bell, Search, ChevronDown } from 'lucide-react';

const Header = () => {
    return (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    {/* Mobile menu button */}
                    <button className="lg:hidden rounded-lg p-2 hover:bg-gray-100">
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>

                    {/* Page Title - You can make this dynamic */}
                    <h1 className="text-lg font-bold text-gray-900">Ba-Dastoor</h1>
                    <span className='text-[#00000094] font-bold'>Dashboard</span>
                    {/* <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1> */}
                </div>

                <div className="flex items-center gap-4">
                    {/* Search bar */}
                    <div className="relative hidden md:block">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="search"
                            className="w-64 rounded-lg border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Search..."
                        />
                    </div>

                    {/* Notifications */}
                    {/* <button className="relative rounded-lg p-2 hover:bg-gray-100">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </button> */}

                    {/* User profile */}
                    {/* <div className="flex items-center gap-3 pl-4 border-l">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-600">AU</span>
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-800">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        </div>
                    </div> */}
                </div>
            </div>
        </header>
    )
}

export default Header
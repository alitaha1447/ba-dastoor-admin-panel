// pages/Dashboard.jsx
import React from 'react';
import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            {/* <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Generate Report
                    </button>
                </div>
            </div> */}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Total Queries</p>
                            <p className="text-2xl font-bold mt-2">1,248</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    {/* <div className="mt-4 flex items-center text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+12% from last month</span>
                    </div> */}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Franchise Requests</p>
                            <p className="text-2xl font-bold mt-2">342</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <Activity className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    {/* <div className="mt-4 flex items-center text-sm text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>+8% from yesterday</span>
                    </div> */}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Job Applications</p>
                            <p className="text-2xl font-bold mt-2">42</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-yellow-600" />
                        </div>
                    </div>
                    {/* <div className="mt-4 flex items-center text-sm text-red-600">
                        <span>12 require attention</span>
                    </div> */}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">Catering Requests </p>
                            <p className="text-2xl font-bold mt-2">98%</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    {/* <div className="mt-4 flex items-center text-sm text-green-600">
                        <span>All systems operational</span>
                    </div> */}
                </div>
            </div>

            {/* Recent Activity */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                    {[
                        { user: 'John Doe', action: 'logged in', time: '5 minutes ago' },
                        { user: 'Sarah Smith', action: 'updated profile', time: '15 minutes ago' },
                        { user: 'Mike Johnson', action: 'submitted leave request', time: '1 hour ago' },
                        { user: 'Lisa Brown', action: 'changed role permissions', time: '2 hours ago' },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                            <div>
                                <p className="font-medium text-gray-800">{activity.user}</p>
                                <p className="text-sm text-gray-600">{activity.action}</p>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default Dashboard;
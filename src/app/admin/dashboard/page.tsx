"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        router.push("/admin/login");
        return;
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role, first_name, last_name')
        .eq('id', session.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setAdminEmail(session.user.email || "");
      setAdminName(`${profile.first_name} ${profile.last_name}`);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Auth check error:', error);
      router.push("/admin/login");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-orange-600 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { name: "Total Orders", value: "24", change: "+12%", icon: "📦" },
    { name: "Revenue Today", value: "$3,456", change: "+8%", icon: "💰" },
    { name: "Active Packages", value: "18", change: "+3", icon: "🎁" },
    { name: "New Customers", value: "12", change: "+5%", icon: "👥" },
  ];

  const recentOrders = [
    { id: "ORD-2024-001234", customer: "John Doe", amount: "$450", status: "Confirmed", date: "2024-03-31" },
    { id: "ORD-2024-001233", customer: "Jane Smith", amount: "$780", status: "Preparing", date: "2024-03-31" },
    { id: "ORD-2024-001232", customer: "Bob Johnson", amount: "$320", status: "Delivered", date: "2024-03-30" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-orange-600">
                CaterSmart
              </Link>
              <span className="text-sm text-gray-500">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">{adminEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {adminName.split(' ')[0]}!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your catering business today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Orders</h3>
            <p className="text-sm text-gray-600">View and manage customer orders</p>
          </Link>
          <Link
            href="/admin/packages"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Packages</h3>
            <p className="text-sm text-gray-600">Create and edit catering packages</p>
          </Link>
          <Link
            href="/admin/menu"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <div className="text-3xl mb-3">🍽️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Menu</h3>
            <p className="text-sm text-gray-600">Update menu items and pricing</p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === "Confirmed" ? "bg-blue-100 text-blue-800" :
                        order.status === "Preparing" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-orange-600 hover:text-orange-700 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <Link href="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all orders →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
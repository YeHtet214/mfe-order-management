import { useEffect, useState } from "react";
import { 
  ShoppingBag, 
  Package, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line
} from "recharts";
import { PageHeader } from "../../components/layout/PageHeader";
import { fetchProducts } from "../../services/productApi";
import { fetchCategories } from "../../services/categoryApi";
import type { Product, Category } from "../../services/types";

export function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [inactiveProducts, setInactiveProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Fetch products (limit to 100 for dashboard summary)
        const productsResponse = await fetchProducts({ per_page: 100 });
        const categoriesResponse = await fetchCategories();
        
        setProducts(productsResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate statistics
  useEffect(() => {
    console.log("products", products);
    if (!products || products.length === 0) return;

    setTotalProducts(products.length);
    setActiveProducts(products.filter(p => p.status === "active").length);
    setInactiveProducts(products.filter(p => p.status === "inactive").length);
    setTotalStock(products.reduce((sum, p) => sum + (p.has_variants ? p.variants.reduce((vSum, v) => vSum + v.stock_quantity, 0) : p.stock_quantity), 0));
  }, [products]);
  
  // Data for Category Bar Chart
  const productsByCategory = categories.map(cat => ({
    name: cat.name,
    count: products.filter(p => p.category_id === cat.id).length
  })).filter(item => item.count > 0);

  // Data for Status Pie Chart
  const statusData = [
    { name: "Active", value: activeProducts, color: "#10B981" }, // emerald-500
    { name: "Inactive", value: inactiveProducts, color: "#EF4444" }, // red-500
  ];

  // Simulated growth data for Line Chart (Recent products added)
  // In a real app, this would be based on created_at timestamps
  const getGrowthData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      name: month,
      products: Math.floor(Math.random() * 20) + (index * 5)
    }));
  };
  const growthData = getGrowthData();

  const statCards = [
    { 
      label: "Total Products", 
      value: totalProducts, 
      icon: ShoppingBag, 
      color: "bg-blue-500", 
      textColor: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    { 
      label: "Total Stock", 
      value: totalStock, 
      icon: Package, 
      color: "bg-purple-500", 
      textColor: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    { 
      label: "Active Products", 
      value: activeProducts, 
      icon: CheckCircle, 
      color: "bg-emerald-500", 
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    { 
      label: "Inactive Products", 
      value: inactiveProducts, 
      icon: XCircle, 
      color: "bg-rose-500", 
      textColor: "text-rose-600",
      bgColor: "bg-rose-50"
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your product inventory and performance"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bgColor} ${stat.textColor}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Products by Category Bar Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Products by Category</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productsByCategory}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Status Pie Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <PieChartIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Inventory Status</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                  }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Inventory Growth (Last 6 Months)</h3>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="products" 
                stroke="#10b981" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

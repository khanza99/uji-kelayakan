<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Ticket;
use App\Models\Concert;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // Summary cards
        $summary = [
            'total_revenue' => Order::where('status', 'paid')->sum('total_amount'),
            'total_orders' => Order::count(),
            'total_tickets' => Ticket::count(),
            'total_concerts' => Concert::count(),
            'total_users' => User::role('user')->count(),
        ];

        // Penjualan per bulan (12 bulan terakhir)
        $monthlySales = Order::where('status', 'paid')
            ->where('created_at', '>=', now()->subMonths(12))
            ->selectRaw('EXTRACT(MONTH FROM created_at) as month, EXTRACT(YEAR FROM created_at) as year, SUM(total_amount) as total, COUNT(*) as count')
            ->groupByRaw('EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)')
            ->orderByRaw('EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)')
            ->get();

        // Penjualan per kategori
        $salesByCategory = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->join('seat_tiers', 'order_items.seat_tier_id', '=', 'seat_tiers.id')
            ->join('concerts', 'seat_tiers.concert_id', '=', 'concerts.id')
            ->join('concert_categories', 'concerts.category_id', '=', 'concert_categories.id')
            ->where('orders.status', 'paid')
            ->selectRaw('concert_categories.name as category, SUM(order_items.price) as total, COUNT(order_items.id) as count')
            ->groupBy('concert_categories.id', 'concert_categories.name')
            ->get();

        // Konser terlaris
        $topConcerts = DB::table('concerts')
            ->join('seat_tiers', 'concerts.id', '=', 'seat_tiers.concert_id')
            ->join('order_items', 'seat_tiers.id', '=', 'order_items.seat_tier_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->selectRaw('concerts.id, concerts.title, concerts.concert_date, SUM(order_items.price) as revenue, COUNT(order_items.id) as tickets_sold')
            ->groupBy('concerts.id', 'concerts.title', 'concerts.concert_date')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get();

        // Tiket per status
        $ticketStatus = Ticket::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get();

        $pendingOrders = Order::where('status', 'pending')->count();
        $pendingRefunds = \App\Models\Refund::where('status', 'pending')->count();

        return response()->json([
            'total_revenue' => $summary['total_revenue'],
            'tickets_sold' => $summary['total_tickets'],
            'active_concerts' => $summary['total_concerts'],
            'total_users' => $summary['total_users'],
            'pending_orders' => $pendingOrders,
            'pending_refunds' => $pendingRefunds,
            
            // Detailed stats
            'monthly_sales' => $monthlySales,
            'sales_by_category' => $salesByCategory,
            'top_concerts' => $topConcerts,
            'ticket_status' => $ticketStatus,
        ]);
    }
}
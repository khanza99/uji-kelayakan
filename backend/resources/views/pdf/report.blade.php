<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #1a1a2e; padding-bottom: 12px; }
        .header h1 { font-size: 20px; color: #1a1a2e; }
        .header p  { font-size: 11px; color: #666; margin-top: 4px; }
        .meta-table { width: 100%; margin-bottom: 16px; font-size: 11px; color: #444; border-collapse: collapse; }
        .meta-table td { padding: 4px 0; border: none; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        thead tr { background: #1a1a2e; color: white; }
        thead th { padding: 8px 10px; text-align: left; font-size: 11px; }
        tbody tr:nth-child(even) { background: #f5f5f5; }
        tbody td { padding: 7px 10px; font-size: 11px; border-bottom: 1px solid #eee; }
        .total-row { font-weight: bold; background: #e8e8f0 !important; }
        .footer { text-align: right; font-size: 11px; color: #999; margin-top: 8px; }
        .badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
        .badge-paid      { background: #d4edda; color: #155724; }
        .badge-pending   { background: #fff3cd; color: #856404; }
        .badge-cancelled { background: #f8d7da; color: #721c24; }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ $title }}</h1>
        <p>
            @if($start_date && $end_date)
                Periode: {{ \Carbon\Carbon::parse($start_date)->format('d M Y') }} -
                          {{ \Carbon\Carbon::parse($end_date)->format('d M Y') }}
            @else
                Semua periode
            @endif
        </p>
    </div>

    <table class="meta-table">
        <tr>
            <td style="text-align: left; width: 33%;">Total Transaksi: {{ $orders->count() }}</td>
            <td style="text-align: center; width: 33%;">Total Pendapatan: Rp {{ number_format($total, 0, ',', '.') }}</td>
            <td style="text-align: right; width: 33%;">Dicetak: {{ now()->format('d M Y H:i') }}</td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kode Order</th>
                <th>Pembeli</th>
                <th>Total</th>
                <th>Status</th>
                <th>Metode Bayar</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orders as $i => $order)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $order->order_code }}</td>
                <td>{{ $order->user->name }}</td>
                <td>Rp {{ number_format($order->total_amount, 0, ',', '.') }}</td>
                <td>
                    <span class="badge badge-{{ $order->status }}">
                        {{ strtoupper($order->status) }}
                    </span>
                </td>
                <td>{{ $order->payment?->payment_method ?? '-' }}</td>
                <td>{{ $order->created_at->format('d/m/Y') }}</td>
            </tr>
            @endforeach
            <tr class="total-row">
                <td colspan="3" style="text-align:right">Total Pendapatan:</td>
                <td colspan="4">Rp {{ number_format($total, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <p class="footer">Dokumen ini digenerate otomatis oleh sistem — {{ now()->format('d M Y H:i:s') }}</p>
</body>
</html>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: Arial, sans-serif;
            background: #fff;
            color: #1a1a1a;
            padding: 24px;
        }
        .header {
            background: #1a1a2e;
            color: white;
            padding: 16px 24px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 { font-size: 22px; letter-spacing: 2px; }
        .header p  { font-size: 12px; opacity: 0.7; margin-top: 4px; }
        .body {
            border: 1px solid #e0e0e0;
            border-top: none;
            border-radius: 0 0 8px 8px;
            padding: 20px 24px;
        }
        .concert-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 4px;
        }
        .concert-sub {
            font-size: 12px;
            color: #666;
            margin-bottom: 16px;
        }
        .info-table {
            width: 100%;
            margin-bottom: 16px;
            border-collapse: collapse;
        }
        .info-table td {
            width: 50%;
            padding: 6px 0;
            vertical-align: top;
        }
        .info-item label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #999;
            display: block;
        }
        .info-item p {
            font-size: 13px;
            font-weight: 600;
            margin-top: 2px;
        }
        .divider {
            border: none;
            border-top: 1px dashed #ccc;
            margin: 16px 0;
        }
        .qr-section {
            text-align: center;
        }
        .qr-section img { width: 160px; height: 160px; }
        .qr-section p {
            font-size: 11px;
            color: #999;
            margin-top: 6px;
        }
        .ticket-code {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 2px;
            margin-top: 8px;
            color: #1a1a2e;
        }
        .footer {
            text-align: center;
            font-size: 10px;
            color: #bbb;
            margin-top: 16px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎵 CONCERT TICKET</h1>
        <p>Simpan tiket ini sebagai bukti masuk</p>
    </div>
    <div class="body">
        <p class="concert-title">{{ $ticket->orderItem->seatTier->concert->title }}</p>
        <p class="concert-sub">
            {{ $ticket->orderItem->seatTier->concert->venue->name }},
            {{ $ticket->orderItem->seatTier->concert->venue->city }}
        </p>

        <table class="info-table">
            <tr>
                <td>
                    <div class="info-item">
                        <label>Tanggal</label>
                        <p>{{ \Carbon\Carbon::parse($ticket->orderItem->seatTier->concert->concert_date)->format('d M Y') }}</p>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <label>Waktu</label>
                        <p>{{ $ticket->orderItem->seatTier->concert->start_time }}</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="info-item">
                        <label>Nama Pemegang</label>
                        <p>{{ $ticket->user->name }}</p>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <label>Kategori Kursi</label>
                        <p>{{ $ticket->orderItem->seatTier->name }}</p>
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    <div class="info-item">
                        <label>Nomor Kursi</label>
                        <p>{{ $ticket->orderItem->seat->seat_number ?? 'Festival' }}</p>
                    </div>
                </td>
                <td>
                    <div class="info-item">
                        <label>Harga</label>
                        <p>Rp {{ number_format($ticket->orderItem->price, 0, ',', '.') }}</p>
                    </div>
                </td>
            </tr>
        </table>

        <hr class="divider">

        <div class="qr-section">
            <img src="{{ $qrImage }}" alt="QR Code">
            <p>Tunjukkan QR code ini kepada petugas</p>
        </div>

        <p class="ticket-code">{{ $ticket->ticket_code }}</p>

        <p class="footer">
            Tiket ini hanya berlaku untuk satu kali masuk.<br>
            Dilarang memperbanyak atau memindahtangankan tiket.
        </p>
    </div>
</body>
</html>
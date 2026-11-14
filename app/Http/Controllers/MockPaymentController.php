<?php

namespace App\Http\Controllers;

use App\Services\KriukCommerce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Mock Payment Controller
 *
 * Simulasi pembayaran tanpa Midtrans.
 * Hanya aktif ketika PAYMENT_MOCK=true di .env
 */
class MockPaymentController extends Controller
{
    public function settle(string $code)
    {
        if (!config('kriuk.payment_mock')) {
            abort(404);
        }

        $order = DB::table('orders')
            ->where('order_code', $code)
            ->where('channel', 'online')
            ->first();

        abort_unless($order, 404);

        if ($order->payment_status !== 'pending') {
            return response()->json([
                'message' => 'Pesanan ini sudah diproses.',
                'paymentStatus' => $order->payment_status,
            ]);
        }

        // Simulasi settlement seperti webhook Midtrans
        KriukCommerce::settle($code, 'settlement', 'accept');

        $updated = DB::table('orders')->where('order_code', $code)->first();

        return response()->json([
            'ok' => true,
            'message' => 'Pembayaran simulasi berhasil!',
            'code' => $code,
            'paymentStatus' => $updated->payment_status,
            'status' => $updated->status,
            'receiptUrl' => $updated->receipt_token
                ? route('receipt.show', $updated->receipt_token)
                : null,
        ]);
    }
}

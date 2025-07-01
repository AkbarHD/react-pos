<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Transaction extends Model
{
    protected $fillable = [
        'customer_id',
        'user_id',
        'store_id',
        'invoice',
        'total_amount',
        'cash',
        'change',
        'discount',
        'payment_method',
        'payment_link_url',
        'transaction_date',
        'status'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function transactionDetails()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transaction) {
            $transaction->invoice = 'INV-' . now()->format('YmdHis') . '-' . strtoupper(Str::random(5));

            if (empty($transaction->transaction_date)) {
                $transaction->transaction_date = Carbon::now();
            }
        });
    }
}

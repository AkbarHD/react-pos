<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $fillable = [
        'customer_id',
        'product_id',
        'user_id',
        'quantity',
        'total_price'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

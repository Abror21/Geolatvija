<?php

namespace App\Enums;

enum MinioBucketTypes: string
{
    const Default = "default";
    const Licence = "licence";

    const Orders = "orders";
    const OrderLicense = "order-license";
    const ftpFiles = "ftp-files";
    const Atom = "atom";
}

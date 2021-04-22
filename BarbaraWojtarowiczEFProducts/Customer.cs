using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BarbaraWojtarowiczEFProducts
{
    [Table("Customers")]
    class Customer: Company
    {
        public float Discount { get; set; }
    }
}

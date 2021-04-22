using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace BarbaraWojtarowiczEFProducts
{
    [Table("Suppliers")]
    class Supplier:Company
    {
        public Supplier()
        {
            Products = new List<Product>();
        }
        public string BankAccountNumber { get; set; }
        public virtual List<Product> Products { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Text;

namespace BarbaraWojtarowiczEFProducts
{
    class Product
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public int UnitsOnStock { get; set; }
        public Supplier Supplier { get; set; }
        public List<InvoiceProduct> InvoiceProducts { get; set; }

    }
}

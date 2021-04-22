using System;
using System.Collections.Generic;
using System.Text;

namespace BarbaraWojtarowiczEFProducts
{
    class InvoiceProduct
    {
        public int ProductID { get; set; }
        public Product Product { get; set; }
        public int InvoiceID { get; set; }
        public Invoice Invoice { get; set; }
    }
}

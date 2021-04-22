using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System.Collections.Generic;
using System.Text;

namespace BarbaraWojtarowiczEFProducts
{
    class Program
    {
        static void Main(string[] args)
        {
            ProductContext productContext = new ProductContext();
            Console.WriteLine("Table-Per-Type Strategy");
            
            // Adding new suppliers
            Supplier supplier1 = new Supplier
            {
                CompanyName = "Supplier1",
                City = "Cracow",
                Street = "Kawiory",
                ZipCode = "11-111",
                BankAccountNumber = "111111",
            };

            productContext.Add(supplier1);

            Supplier supplier2 = new Supplier
            {
                CompanyName = "Supplier2",
                City = "Warsaw",
                Street = "Marszałkowska",
                ZipCode = "22-222",
                BankAccountNumber = "222222",
            };

            productContext.Add(supplier2);

            // Adding new customers
            Customer customer1 = new Customer
            {
                CompanyName = "Customer1",
                City = "London",
                Street = "Pickadilly",
                ZipCode = "33-333",
                Discount = 0.2f,
            };

            productContext.Add(customer1);

            Customer customer2 = new Customer
            {
                CompanyName = "Customer2",
                City = "Athens",
                Street = "Akropolis",
                ZipCode = "44-444",
                Discount = 0.3f,
            };

            productContext.Add(customer2);

            Product product1 = new Product
            {
                ProductName = "Apples",
                Supplier = supplier1,
            };

            productContext.Products.Add(product1);
            productContext.SaveChanges();

            // Printing newly added suppliers and customers
            var suppliers = productContext.Companies.OfType<Supplier>();
            var customers = productContext.Companies.OfType<Customer>();

            Console.WriteLine("SUPPLIERS: ");
            foreach (var supp in suppliers)
            {
                Console.WriteLine("Suplier: " + supp.CompanyName + "with bank account number: " + supp.BankAccountNumber);
            }

            Console.WriteLine("CUSTOMERS: ");
            foreach(var cus in customers)
            {
                Console.WriteLine("Customer: " + cus.CompanyName + "with discount value: " + cus.Discount);
            }

        }
    }
}

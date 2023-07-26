using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineOrderAPI.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ProductID
        {
            get;
            set;
        }

        public string ProductName
        {
            get;
            set;
        }

        public double Price
        {
            get;
            set;
        }

        public int Stock
        {
            get;
            set;
        }

    }
}

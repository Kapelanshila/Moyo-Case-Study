using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineOrderAPI.Models
{
    public class OrderLine
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderLineID
        {
            get;
            set;
        }

        [ForeignKey("Order")]
        public int OrderID
        {
            get;
            set;
        }

        [ForeignKey("Product")]
        public int ProductID
        {
            get;
            set;
        }


        [ForeignKey("User")]
        public int UserID
        {
            get;
            set;
        }

        public int Quantity
        {
            get;
            set;
        }

    }
}

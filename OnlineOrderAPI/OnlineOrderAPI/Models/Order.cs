using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineOrderAPI.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderID
        {
            get;
            set;
        }

        public DateTime Date
        {
            get;
            set;
        }

        public string Description
        { 
            get;
            set;
        }

    }
}

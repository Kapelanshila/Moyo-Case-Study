namespace OnlineOrderAPI.Models
{
    public class OrderVM
    {
        public ProductVM[] Products
        {
            get;
            set;
        }

        public int UserID
        {
            get;
            set;
        }

        public int OrderID
        {
            get;
            set;
        }

        public int OrderLineID
        {
            get;
            set;
        }

        public int Quantity
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

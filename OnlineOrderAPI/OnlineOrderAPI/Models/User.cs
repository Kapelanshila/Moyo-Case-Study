using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineOrderAPI.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserID
        {
            get;
            set;
        }

        [ForeignKey("UserRole")]
        public int UserRoleID 
        { 
            get; 
            set; 
        }

        public string UserName
        {
            get;
            set;
        }

        public string Password_Hashed
        {
            get;
            set;
        }

    }
}
